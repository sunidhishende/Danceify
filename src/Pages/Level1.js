import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef,useState,useEffect } from 'react';
import backend from '@tensorflow/tfjs-backend-webgl';
import Webcam from 'react-webcam';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import LoadingOverlay from '@ronchalant/react-loading-overlay'
import {POINTS, keypointConnections } from '../Helper/data'
import { drawPoint, drawSegment } from '../Helper/functions';

//StyledComponents
const Videocontainer= styled.div`
  width:50%;
  height:100vh;
  padding:0;
  margin: 0 ;
  position: relative;
`
let skeletonColor = 'rgb(255,255,255)'

let interval

function Level1() {

  //gradients from the dance video
  const data= require('../Helper/data/actualgradients.json')

  //for downloading webcam video
  const mediaRecorderRef = React.useRef(null);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [capturing, setCapturing] = React.useState(false);

  //webcamvid
  const webcamRef = useRef(null)

  //canvas is where body skeleton is displayed
  const canvasRef = useRef(null)

  //done is boolean for loading overlay 
  const [done,setDone]=useState(false)

  //playing is boolean for playing the dance video
  const [playing, setPlaying]=useState(false);
  
  //to count the no. of keypoint objects recorded
  var count=0 
  // const [count,setCount]=useState(0);
  // const[coords,setCoords]=useState([]);
  var countcheck=0;

  //functions for downloading the video
  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );
 
  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);
 
  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  //body tracking
  const runMovenet = async () => {
    //creating config for body tracking
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);

    //interval every 100ms for real time body tracking
    interval = setInterval(() => { 
      countcheck=detectPose(detector)
      // console.log(count)
      // if(countcheck){setCount(count+1)}
      if(count==1){
        setDone(true)
      }   
      if(count==5){
        setPlaying(true)
      }
        else if (count>=100){
          setPlaying(false)
        }
    }, 100)
  }

  //estimate poses detects keypoints and then points, segments are drawn
  const detectPose = async (detector) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video
      const pose = await detector.estimatePoses(video)
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      try {
        const keypoints = pose[0].keypoints 
        // console.log(keypoints["0"]["y"])
        keypoints.map((keypoint) => {
          if(keypoint.score > 0.4) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, 'rgb(255,255,255)')
              let connections = keypointConnections[keypoint.name]
              try {
                connections.forEach((connection) => {
                  let conName = connection.toUpperCase()
                  drawSegment(ctx, [keypoint.x, keypoint.y],
                      [keypoints[POINTS[conName]].x,
                       keypoints[POINTS[conName]].y]
                  , skeletonColor)
                })
              } catch(err) {
                
              }
          } 
          
        }) 
        if (count<100){
          computescore(keypoints)} 

        return [keypoints["0"]["y"]] 
      } catch(err) {
        console.log(err)
      }   
      
    }
   
  
  }

  //computing the score which is abs(difference of gradients average)
    function computescore(userkeypoints){
      const numbers=[0,3,4,5,6,7,8,11,12,13,14]
      const gradients=[]
      var score=0
      try{
      for(var i of numbers){
        var conn="" 
        var conname=""
        conn=userkeypoints[i]["name"]  
                                                                                         
        Object.values(keypointConnections[conn]).forEach(val=> {
          conname =val.toUpperCase()
          gradients.push(calculategradient( userkeypoints[i]["y"],
                                            userkeypoints[i]["x"],
                                            userkeypoints[POINTS[conname]]["y"],
                                            userkeypoints[POINTS[conname]]["x"]))
        })
      }
    }catch(err){console.log(err)}
      for(let x=0;x<gradients.length;x++){
          score+= Math.abs(data[count][x]-gradients[x])
      }
      score=score/gradients.length
      console.log(score)
      count++
      // console.log("helloooo"+count)
      // setCount(count+1)
      // console.log(userkeypoints["0"])
      //gradients to be calculated- all keypoint connections
    }

    //gradient calculator
    function calculategradient(y1,x1,y2,x2){
      var gradient=0
      gradient= (y1-y2)/(x1-x2)
      return gradient
    }
    
    //calls movenet which basically starts the entire thing
    runMovenet()

    //for webcam
    const videoConstraints = {
        width: 750,
        height: 700
    };
  
    return (      
      <> 
      <LoadingOverlay
        active={!done}
        spinner
        text='Dance like no one is watching!'>
        <div style={{display:'flex', width:'100%'}}>
        <Videocontainer> <ReactPlayer
          width="100%"
          height={videoConstraints.height}
          url='videos/dance10.mp4'
          playing={playing}
          muted={false}
           /></Videocontainer>
           <Videocontainer>
          <Webcam 
              videoConstraints={videoConstraints}
              ref={webcamRef}
              style={{ margin:'0',transform: "scaleX(-1)", inline:true}}
          />
          <canvas
                ref={canvasRef}
                id="my-canvas"
                width={videoConstraints.width}
                height={videoConstraints.height}
                style={{
                    left:'0px',
                    top:'0px',
                    margin:'0',
                    position: 'absolute',
                    transform: "scaleX(-1)",
                    inline:true,
                   }}
                   >
               </canvas>
               </Videocontainer>
               </div>
          {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
          {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}
          </LoadingOverlay>
          
      </>
    )
  
}

export default Level1