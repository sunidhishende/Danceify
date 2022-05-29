import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef,useState,useEffect,useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import backend from '@tensorflow/tfjs-backend-webgl';
import Webcam from 'react-webcam';
import ReactPlayer from 'react-player';
import styled from 'styled-components';
import LoadingOverlay from '@ronchalant/react-loading-overlay'
import {POINTS, keypointConnections } from '../Helper/data'
import { drawPoint, drawSegment,computescore } from '../Helper/functions';
import styledComponents from 'styled-components';


//StyledComponents
const Videocontainer= styled.div`
  width:50%;
  height:100vh;
  padding:0;
  margin: 0 ;
  position: relative;
`
const H3= styled.h3`
color: white;

`
const Button= styled.button`
background-color: #d0d8fa;
border: none;
color: black;
padding: 15px 100px;
text-align: center;
font-size: 25px;
text-decoration: none;
display: inline-block;
margin: 20px ;
cursor: pointer;
border-radius: 200px;`

const H1= styled.h1`
background: #FFFFFF;
background: linear-gradient(to right, #FFFFFF 0%, #838FFF 90%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;   
font-weight: 400;
font-size: 70px;
font-family: Iceland;
margin: 0px 0px 0px 0px;
text-align: center;
`

//colour of the body skeleton
let skeletonColor = 'rgb(255,255,255)'

let interval
var check=0;
const initialState = {
  isPlaying: false,
  count: 0
};

function Level1() {
  const location=useLocation();
  var level= location.pathname.split("/")[2];
  level=level.toString();
  const data = require(`../Helper/data/actualgradients${level}.json`)
  const vidurl=`/videos/dance${level}.mp4`

  //for webcam
  const videoConstraints = {
    width: 750,
    height: 700
  };

  //for downloading webcam video
  const mediaRecorderRef = React.useRef(null);
  const [recordedChunks, setRecordedChunks] = React.useState([]);
  const [capturing, setCapturing] = React.useState(false);
  //webcamvid
  const webcamRef = useRef(null)

  //canvas is where body skeleton is displayed
  const canvasRef = useRef(null)

  //to display the score
  const[score,setScore]=useState(0)

  const[over,setOver]=useState(true)

  const [state, dispatch] = useReducer(reducer, initialState);
  const idRef = useRef(0);

  useEffect(() => {
    if (!state.isPlaying) {
      return;
    }
    idRef.current = setInterval(() => dispatch({ type: "increment" }), 100);
    return () => {
      clearInterval(idRef.current);
      idRef.current = 0;
    };
  }, [state.isPlaying]);

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
      detectPose(detector)
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
        if (state.isPlaying){
          console.log("HIIIIIIIII")
          setScore(computescore(keypoints, state.count,data))} 
          check++;
          if(check==1){
            dispatch({ type: "start" });
            check++;
          }

          keypoints.map((keypoint) => {
          //Drawing the points and segments
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
              } catch(err) {}
          }  
        });

      } catch(err) {
        console.log(err)
      }   
    } 
  }

  function reducer(state, action) {
    switch (action.type) {
      case "start": {
        console.log("STARTING...!!!!")
        return { ...state, isPlaying: true };
      }
      case "stop":
        console.log("STOPPING...!!!!")
        return { ...state, isPlaying: false };
      case "increment": {
        console.log("BEFORE COUNT INCREMENT:"+JSON.stringify(state));
        return { ...state, count: state.count + 1 };
      }
      default:
        throw new Error();
    }
  }
  
  //calls movenet which basically starts the entire thing
  function startMovenet(){
    setOver(false)
    runMovenet()
    handleStartCaptureClick()
  }

  function stopMovenet(){
    setOver(true)
    clearInterval(interval) 
    dispatch({ type: "stop" })
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    handleStopCaptureClick()    
  }

    return (      
      <> 
      <LoadingOverlay
        active={(!state.isPlaying)&&(!over)}
        spinner
        text='Dance like no one is watching!'>
        <H1>{"Level "+level}</H1>
        <div style={{display:'flex', width:'100%'}}>
        {over&&<Button onClick={startMovenet}>Start Level</Button>}
        <H3>Score:{score}</H3>
        {recordedChunks.length > 0 && (
        <Button onClick={handleDownload}>Download</Button>
      )}
        </div>
        <div style={{display:'flex', width:'100%'}}>
        <Videocontainer>
        <ReactPlayer
          width="100%"
          height={videoConstraints.height}
          url={vidurl}
          playing={state.isPlaying}
          onEnded={stopMovenet}
          muted={false}
           />
          
        </Videocontainer>
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
          </LoadingOverlay>  
      </>
    )
}

export default Level1