import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef,useState,useEffect } from 'react';
import backend from '@tensorflow/tfjs-backend-webgl';
import Webcam from 'react-webcam';
import ReactPlayer from 'react-player'

const POINTS = {
  NOSE : 0,
  LEFT_EYE : 1,
  RIGHT_EYE : 2,
  LEFT_EAR : 3,
  RIGHT_EAR : 4,
  LEFT_SHOULDER : 5,
  RIGHT_SHOULDER : 6,
  LEFT_ELBOW : 7,
  RIGHT_ELBOW : 8,
  LEFT_WRIST : 9,
  RIGHT_WRIST : 10,
  LEFT_HIP : 11,
  RIGHT_HIP : 12,
  LEFT_KNEE : 13,
  RIGHT_KNEE : 14,
  LEFT_ANKLE : 15,
  RIGHT_ANKLE : 16,
}

const keypointConnections = {
  nose: ['left_ear', 'right_ear'],
  left_ear: ['left_shoulder'],
  right_ear: ['right_shoulder'],
  left_shoulder: ['right_shoulder', 'left_elbow', 'left_hip'],
  right_shoulder: ['right_elbow', 'right_hip'],
  left_elbow: ['left_wrist'],
  right_elbow: ['right_wrist'],
  left_hip: ['left_knee', 'right_hip'],
  right_hip: ['right_knee'],
  left_knee: ['left_ankle'],
  right_knee: ['right_ankle']
}

function drawSegment(ctx, [mx, my], [tx, ty], color) {
  ctx.beginPath()
  ctx.moveTo(mx, my)
  ctx.lineTo(tx, ty)
  ctx.lineWidth = 5
  ctx.strokeStyle = color
  ctx.stroke()
}

function drawPoint(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

let skeletonColor = 'rgb(255,255,255)'
let interval

function Start() {
  const [playing, setPlaying]=useState(false);
  const[coords,setCoords]=useState([]);
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const runMovenet = async () => {
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    interval = setInterval(() => { 
        detectPose(detector)
    }, 1000)
  }
  useEffect(()=>{
      if(coords.length==1){
        setPlaying(true)
        console.log(playing)
        console.log(coords)
      }
      else if (coords.length==100){
        setPlaying(false)
        
        //to be done here- send data for final score and display final score and clear coords and stop interval in movenet

      }
  })
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
        if(coords.length<=100){
            // console.log(keypoints)
            setCoords((coords)=>[...coords,{keypoints}])
            
            //to be done here- measure difference and display score
            // console.log(coords[0])
            // console.log(coords) 
        }
        
        let input = keypoints.map((keypoint) => {
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
          return [keypoint.x, keypoint.y]
        }) 
      } catch(err) {
        console.log(err)
      }     
    }
  }

    function begin(){
        runMovenet()
    } 

    const videoConstraints = {
        width: 760,
        height: 640
        
    };
  
    return (
            <>
            <button onClick={begin}>Begin</button>
            <td><ReactPlayer
                width='215%'
                height='215%'
                url='videos/dance10.mp4'
                playing={playing}
                muted={false}
                style={{
                    inline:true
                }}
                    /></td>
            <td>
            <Webcam
                    videoConstraints={videoConstraints}
                    ref={webcamRef}
                    style={{
                        position: 'absolute',
                        left:650,
                        inline:true,
                        transform: "scaleX(-1)"
                    }} />
            <canvas
                    ref={canvasRef}
                    id="my-canvas"
                    width='760'
                    height='640'
                    style={{
                        position: 'absolute',
                        left:650,
                        inline:true,
                        transform: "scaleX(-1)"
                    }}>
                </canvas>
            </td>
            </>
    )
  
}

export default Start