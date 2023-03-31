import React,{useEffect,useState,useContext, useRef} from 'react'
import { gettime } from '../../helper'
import  {Avatar,Badge,Button} from "../../node_modules/@mui/material";
import Chattooltip from "./chatcontooltip";
import classes from './chatcontainer.module.css'
import {CloseOutlined,MoreHoriz, Videocam, VideocamOff, MicOff, Phone} from "@mui/icons-material";
import { useRouter } from 'next/router';
import Pushercontext from '../../pushercontext';

function Header({frienddata,user,deletemsg}) {
    
    let [show,setshow] = useState(false);
    let [ontooltip,setontooltip] = useState(false);
    let [time,settime] = useState(0);
    const router = useRouter()
    const { callUser,answerCall, callAccepted, userVideo, callEnded, call, leaveCall,rejectCall,calloff} = useContext(Pushercontext);
    const [stream, setStream] = useState(true);
    const[showcalling,setshowcalling] = useState('')
   
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

      useEffect(()=>{},[showcalling])

      function closechat(){
        router.push(`/`)
    }

    function setstream(currentStream,actiontype,calltype){
      setStream(currentStream)
      if(actiontype === 'call'){
        callUser(frienddata._id,currentStream,user.name,calltype)
      }else{
        answerCall(currentStream)
      }
      console.log(showcalling)
      myVideo.current.srcObject = currentStream
    }

    function getstream(actiontype,calltype){
      if(navigator.mediaDevices?.enumerateDevices){
        navigator.mediaDevices.enumerateDevices().then( devices =>{
          if((calltype === 'video' && devices.filter(device => device.kind === 'videoinput')).length >= 1 ){
              
              navigator.mediaDevices.getUserMedia({video:true, audio: true }).
              then(currentStream=>{
                setstream(currentStream,actiontype,calltype)
              }).catch(error=> {
                navigator.mediaDevices.getUserMedia({audio: true }).
                then(currentStream=>{
                  setstream(currentStream,actiontype,calltype)
                })
              }
              )
          }else{
              navigator.mediaDevices.getUserMedia({audio: true }).
              then(currentStream=>{
                  setstream(currentStream,actiontype,calltype)
              })
          }  
        })
      }else{
        prompt('this app is not allowed to use this device mediastream' )
      }
    }

    function recivecall(calltype){
      
      setshowcalling(calltype)
      getstream('answer',calltype)
    }

    function startcall(calltype){
      setshowcalling(calltype)
      getstream('call',calltype)
    }

    function cancelcall(){
      setshowcalling('')
      calloff()
    }

    console.log(`uservidioheader${userVideo}`)

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
        <div style={{display:'flex',justifyContent:'space around',gap:'2px'}}>
            <Phone variant="contained" color="primary"  sx={{ width :25, height:22}} onClick={()=>startcall('audio')}/>
            <Videocam variant="contained" color="primary"  sx={{ width :25, height:25}} onClick={()=>startcall('video')} />
            <MoreHoriz color="primary" id='tool' onMouseEnter={handelMouseenter} onMouseLeave={handelMouseleave}/> 
            {show === 'tool'  && <Chattooltip  onmouseenter={handeltooltipenter} onmouseleave={handeltooltipleave} user={user} friendemail={frienddata.email} deletemsg={deletemsg}/>}         
            <CloseOutlined sx={{ width :25, height:25}} color="primary" onClick={closechat}/>
        </div>

        {showcalling && <div className={callAccepted ? classes.video: classes.startcall}>
          {showcalling === 'video' ? <video playsInline ref={myVideo} autoPlay/> :
              <audio playsInline ref={myVideo} autoPlay></audio>
          }

          {!callAccepted && <div style={{backgroundColor:'levender',textAlign:'center',height:'200px'}}>
            <p style={{fontSize:'20px',color:'gray',fontWeight:'bold',paddingTop:'10px'}}>{`calling... ${frienddata.name}`}</p>
            <Button variant="contained" color="secondary" fullWidth onClick={cancelcall} >
          cancelcall
      </Button></div>}

        </div>}
        {callAccepted && !callEnded && 
  <div className={classes.callAccepted}>
        {showcalling === 'video' ? <video playsInline ref={userVideo} autoPlay/> :
              <audio style={{height:'300px',backgroundColor:'levender'}} playsInline ref={userVideo} autoPlay></audio>
          }
      
      <div className={classes.callopt}>
      <MicOff onClick={toggleMic}/>
      {call.type === 'video' && <VideocamOff onClick={toggleCamera}/>}
      </div>
      <Button variant="contained" color="secondary" fullWidth onClick={leavecall} >
          Endcall
      </Button>
  </div>
}

         {call.isReceivingCall && !callAccepted && 
<div className={classes.answercall} >
    <audio src='/music/ringtone.mp3' autoPlay></audio>
    <h3>{call.name} is {call.type} calling:</h3>
    <div >
    <Button variant="outlined" color="success" sx={{ width :50, height:25}} onClick={()=>recivecall(call.type)}>
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
