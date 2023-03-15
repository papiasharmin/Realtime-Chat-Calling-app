import React,{useEffect, useRef, useState} from 'react'
import classes from './chatcontainer.module.css';
import {Mic,RecordVoiceOverOutlined} from "@mui/icons-material"


const Record = ({sendmassage}) => {

  let [showaudio,setshowaudio] = useState(false)
  let [recording,setrecording] = useState(false)
  const recordref = useRef(null)
  const recordstopref = useRef(null)

    function showaudiohandlar(){   
      setshowaudio(prev => !showaudio)
    }

    function closeaudio(){
      setshowaudio(prev => !showaudio)
    }

    useEffect(()=>{
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices
            .getUserMedia({
                audio: true,
              })
            .then((stream) => {
                   const mediaRecorder = new MediaRecorder(stream);
                   let chunks = [];
         
                   recordref.current.onclick = ()=> {
                         
                         mediaRecorder.start();
                         setrecording(true) 
                   };
        
                    mediaRecorder.ondataavailable = (e) => {
                         chunks.push(e.data);
                    };
        
                    recordstopref.current.onclick = ()=> { 
                         mediaRecorder.stop();    
                    };
        
                     mediaRecorder.onstop = (e) => {
                         
                         const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
                          chunks = [];
                          const fileReader = new FileReader();
                          fileReader.onload = () => {
                            const srcData = fileReader.result;
                            sendmassage(srcData,'audio/ogg')   
                          };
                          fileReader.readAsDataURL(blob);
                          setrecording(false)
                         
                      };
             })
            .catch((err) => {
               console.error(`The following getUserMedia error occurred: ${err}`);
            });
        } else {
          console.log("getUserMedia not supported on your browser!");
        }
          
    },[showaudio])

    return (
        <>
          <Mic fontSize="small" onClick={showaudiohandlar}/>
          { showaudio &&  <div  className={classes.audio} >
                            {recording &&  <RecordVoiceOverOutlined className={classes.recording} style={{width:'100px',height:'70px'}} color='primary'/>}
                            <div>
                              <button onClick={closeaudio}>Close</button>
                              <button ref={recordref}>start</button>
                              <button ref={recordstopref}>stop</button>
                            </div>
                          </div>
          }
         </>
    )
}

export default Record