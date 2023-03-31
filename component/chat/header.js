import React,{useEffect,useState,useContext, useRef} from 'react'
import { gettime } from '../../helper'
import  {Avatar,Badge,Button} from "../../node_modules/@mui/material";
import Chattooltip from "./chatcontooltip";
import classes from './chatcontainer.module.css'
import {CloseOutlined,MoreHoriz, Videocam, VideocamOff, MicOff} from "@mui/icons-material";
import { useRouter } from 'next/router';
import Pushercontext from '../../pushercontext';

function Header({frienddata,user,deletemsg}) {
    
    let [show,setshow] = useState(false);
    let [ontooltip,setontooltip] = useState(false);
    let [time,settime] = useState(0);
    const router = useRouter()
    const { callUser,answerCall, callAccepted, userVideo, callEnded, call, leaveCall,rejectCall} = useContext(Pushercontext);
    const [stream, setstream] = useState(true);
   
    const myVideo = useRef()
   
    function handelMouseenter(event){    
        setshow(event?.currentTarget.id)  
    };
     
     function handelMouseleave(){ 
       settime(setTimeout(()=>{    
           if(!ontooltip){
             setshow(null)
           }
         },1000)
       )  
     };

     function handeltooltipenter(){  
       setontooltip(true)
     };
   
     function handeltooltipleave(){
       setontooltip(false)
       setshow('')
     };

     useEffect(()=>{ 
        if(ontooltip || show){
          clearTimeout(time)
        }else{
          handelMouseleave()
        }
      },[ontooltip,show])

      function closechat(){
        router.push(`/`)
    }

    function answercall(){

    if(navigator.mediaDevices?.enumerateDevices){
      navigator.mediaDevices.enumerateDevices().then( devices =>{
        devices.forEach((device) => {
          console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
        });
        
        devices.forEach((device) => {
          console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
        });
  
        navigator.mediaDevices.getUserMedia({video:true, audio: true }).then(currentStream=>{
          setstream(currentStream)
                   answerCall(currentStream)
                   myVideo.current.srcObject = currentStream
        })
        
      })
    }else{
      prompt('this app is not allowed to use this device mediastream' )
    }
    }
    console.log(userVideo)

    function calluser(){
      
      if(navigator.mediaDevices?.enumerateDevices){
        navigator.mediaDevices.enumerateDevices().then( devices =>{
          devices.forEach((device) => {
            console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
          });
         
          devices.forEach((device) => {
            console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
          });
          
          navigator.mediaDevices.getUserMedia({video:true, audio: true }).then(currentStream=>{
            setstream(currentStream)
            callUser(frienddata._id,currentStream,user.name)
            myVideo.current.srcObject = currentStream
          })
          
        })
      }else{
        prompt('this app is not allowed to use this device mediastream' )
      }
    }

    function leavecall(){
      myVideo.current.srcObject = null
      leaveCall()

    }
 
    const toggleMic = () => {
      
      const track = stream.getAudioTracks();
      track[0].enabled = !track[0].enabled
  
    };
  
    const toggleCamera = () => {
 
      const track = stream.getVideoTracks();
       if(track.length >0){
        track[0].enabled = !track[0].enabled
       }
      
    };

    const avatar =  <div className={classes.avatarbor}> 
                        <Badge className={frienddata.status == 'online'? classes.badge : classes.badgeoff} overlap="circular" variant="dot"></Badge>
                        <Avatar src={frienddata.photo ? frienddata.photo : ''} className={classes.avatar} width={50} height={50}>{frienddata?.name?.slice(0,1)} </Avatar> 
                    </div> 
 
  return (
    <header>
        <div className={classes.recipient}>
            {avatar}
            <div>
               <h3>{frienddata.name}</h3>
               <p>{frienddata.status === 'offline' ? `Last Seen At ${gettime(frienddata.lastseen)}` : frienddata.status}</p>
            </div>
        </div>
        <div>
            <Videocam variant="contained" color="primary"  sx={{ width :25, height:25}} onClick={calluser} />
            <MoreHoriz color="primary" id='tool' onMouseEnter={handelMouseenter} onMouseLeave={handelMouseleave}/> 
            {show === 'tool'  && <Chattooltip  onmouseenter={handeltooltipenter} onmouseleave={handeltooltipleave} user={user} friendemail={frienddata.email} deletemsg={deletemsg}/>}         
            <CloseOutlined sx={{ width :25, height:25}} color="primary" onClick={closechat}/>
        </div>
        <div className={classes.video}><video playsInline ref={myVideo} autoPlay  /></div>
        {callAccepted && !callEnded && 
  <div className={classes.callAccepted}>
      <video playsInline ref={userVideo} autoPlay  />
      <div className={classes.callopt}>
      <MicOff onClick={toggleMic}/>
      <VideocamOff onClick={toggleCamera}/>
      </div>
      <Button variant="contained" color="secondary" fullWidth onClick={leavecall} >
          Endcall
      </Button>
  </div>
}

         {call.isReceivingCall && !callAccepted && 
<div className={classes.answercall} >
    <audio src='/music/ringtone.mp3' autoPlay></audio>
    <h3>{call.name} is calling:</h3>
    <div >
    <Button variant="outlined" color="success" sx={{ width :50, height:25}} onClick={answercall}>
        Answer
    </Button>
    <Button variant="outlined" color="error" sx={{ width :50, height:25}} onClick={rejectCall}>
       Reject
    </Button>
    </div>

</div>
}

        
    </header>
  )
}

export default Header
