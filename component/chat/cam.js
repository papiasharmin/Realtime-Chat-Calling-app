import React,{useCallback,useRef, useState} from 'react'
import classes from './chatcontainer.module.css'
import Webcam from "react-webcam";
import { Camera} from "@mui/icons-material";
import { useRouter } from 'next/router';

const videoConstraints = {
    width: 680,
    height: 600,
    facingMode: "user"
  };

const Cam = ({sendmassage}) => {
    const [showcam,setshowcam] = useState(false)
    const webcamRef = useRef(null);
    const router = useRouter()

    function showcamhandler(){
        setshowcam(prev => !showcam)  
    }
    function closecam(){
        setshowcam(prev => !showcam)   
    }

    const capture = useCallback(() => {

        const imageSrc = webcamRef.current.getScreenshot();
        sendmassage(imageSrc,'image/jpeg') 
  
    },[webcamRef,router.query.chatid]);
 
  return (
    <>
        <Camera fontSize="small" onClick={showcamhandler}/>
        {showcam && <div className={classes.webcam} >
                <Webcam
                    style={{width:'100%',height:'80%'}}
                    audio={false}
                    
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    
                    videoConstraints={videoConstraints}
   
                /> 
                
                <button onClick={capture}>Capture</button>
                <button onClick={closecam}>Close</button>
            </div>
        }
    </>
  )
}

export default Cam