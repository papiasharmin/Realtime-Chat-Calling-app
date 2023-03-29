import React,{useEffect,useState,useContext, useRef} from 'react'
import { gettime } from '../../helper'
import  {Avatar,Badge,Button} from "../../node_modules/@mui/material";
import Chattooltip from "./chatcontooltip";
import classes from './chatcontainer.module.css'
import {CloseOutlined,MoreHoriz, VideoCall,PhoneDisabled} from "@mui/icons-material";
import { useRouter } from 'next/router';
import Pushercontext from '../../pushercontext';

function Header({frienddata,user,deletemsg}) {
    
    let [show,setshow] = useState(false);
    let [ontooltip,setontooltip] = useState(false);
    let [time,settime] = useState(0);
    const router = useRouter()
    const { callUser,answerCall, callAccepted, userVideo, callEnded, call, leaveCall,} = useContext(Pushercontext);
    let [showmyved,setshowmyved] = useState(false);
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

    // useEffect(()=>{
    //   if(myvideostream && !myVideo.current){
    //     myVideo.current.srcObject = myvideostream
    //   }
    // },[myvideostream])

    useEffect(()=>{
      if(callEnded && myVideo.current){
        setshowmyved(false)
        myVideo.current.srcObject = null
      }
    },[callEnded])

    function answercall(){
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { 
        navigator.mediaDevices.getUserMedia({ video:true, audio: true })
          .then((currentStream) => {
            console.log(currentStream)
            
            // if(myVideo.current.srcObject ){
            //   myVideo.current.srcObject = currentStream
            // }else{
            //   myVideo.current.src = currentStream
            // }
            answerCall(currentStream)
            myVideo.current.srcObject = currentStream
        }).catch((error) =>{
          console.log(error)
        })
        } 
    }

    function calluser(){
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((currentStream) => {
            console.log(currentStream)
            
            // if(myVideo.current.srcObject ){
            //   myVideo.current.srcObject = currentStream
            // }else{
            //   myVideo.current.src = currentStream
            // }
            myVideo.current.srcObject = currentStream
            callUser(frienddata._id,currentStream)
            
        });
        }  
    }

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
            <VideoCall variant="contained" color="primary"  sx={{ width :25, height:25}} onClick={calluser} />
            <MoreHoriz color="primary" id='tool' onMouseEnter={handelMouseenter} onMouseLeave={handelMouseleave}/> 
            {show === 'tool'  && <Chattooltip  onmouseenter={handeltooltipenter} onmouseleave={handeltooltipleave} user={user} friendemail={frienddata.email} deletemsg={deletemsg}/>}         
            <CloseOutlined sx={{ width :25, height:25}} color="primary" onClick={closechat}/>
        </div>
        <div className={classes.video}><video playsInline ref={myVideo} autoPlay  /></div>
          {callAccepted && !callEnded && 
  <div className={classes.callAccepted}>
      <video playsInline ref={userVideo}  autoPlay  />
      <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} >
          Hang Up
      </Button>
  </div>
}
         {call.isReceivingCall && !callAccepted && 
<div className={classes.answercall} >
    <h3>{call.name} is calling:</h3>
    <Button variant="contained" color="primary" sx={{ width :50, height:25}} onClick={answercall}>
        Answer
    </Button>

</div>
}

        
    </header>
  )
}

export default Header
