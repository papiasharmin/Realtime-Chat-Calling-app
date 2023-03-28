import React,{useEffect,useState,useContext, useRef} from 'react'
import { gettime } from '../../helper'
import  {Avatar,Badge,Button } from "../../node_modules/@mui/material";
import Chattooltip from "./chatcontooltip";
import classes from './chatcontainer.module.css'
import {CloseOutlined,MoreHoriz, Notifications, Phone, VideoCall} from "@mui/icons-material";
import { useRouter } from 'next/router';
import Pushercontext from '../../pushercontext';

function Header({frienddata,user,deletemsg}) {
    
    let [show,setshow] = useState(false);
    let [ontooltip,setontooltip] = useState(false);
    let [time,settime] = useState(0);
    const router = useRouter()
    const puserctx = useContext(Pushercontext)
    const {setStream,stream,  setName, callUser} = useContext(Pushercontext);
    const myVideo = useRef()
    const friendVideo = useRef()
    //puserctx.setmyvideo(myVideo);
    //puserctx.setfriendvideo(friendVideo)
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

    function call(){
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((currentStream) => {
            setStream(currentStream);
            console.log(currentStream)
            myVideo.current.srcObject = currentStream
            if(!stream){
              myVideo.current.srcObject = stream
            }
        });
        }
        setName(user.name)
        // console.log(friendsocket)
        // console.log(id)
        
          callUser(frienddata._id)
        
        //callUser(id)
       
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
            <VideoCall variant="contained" color="primary"  fullWidth onClick={call} />
            <MoreHoriz color="primary" id='tool' onMouseEnter={handelMouseenter} onMouseLeave={handelMouseleave}/> 
            {show === 'tool'  && <Chattooltip  onmouseenter={handeltooltipenter} onmouseleave={handeltooltipleave} user={user} friendemail={frienddata.email} deletemsg={deletemsg}/>}         
            <CloseOutlined sx={{ width :25, height:25}} color="primary" onClick={closechat}/>
        </div>
        <div className={classes.video}><video playsInline muted ref={myVideo} autoPlay  /></div>
        
    </header>
  )
}

export default Header
