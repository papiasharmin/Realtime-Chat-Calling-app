import React,{useEffect,useState,useContext, useRef} from 'react'
import { gettime } from '../../helper'
import  {Avatar,Badge,Button } from "../../node_modules/@mui/material";
import Chattooltip from "./chatcontooltip";
import classes from './chatcontainer.module.css'
import {CloseOutlined,MoreHoriz, Notifications, Phone, VideoCall} from "@mui/icons-material";
import { useRouter } from 'next/router';
import { SocketContext } from '../../socketctx';
function Header({frienddata,user,deletemsg,notify,friendsocket}) {
    
    let [show,setshow] = useState(false)
    let [ontooltip,setontooltip] = useState(false)
    let [time,settime] = useState(0)
    const {setStream,stream,  setName, callUser,id} = useContext(SocketContext);
    const router = useRouter()
    //const [stream,setStream] = useState(null);
    const myVideo = useRef()
    function handelMouseenter(event){  
      
        setshow(event?.currentTarget.id)  
       // deletenotify()
     }
     
     function handelMouseleave(){ 
       settime(setTimeout(()=>{    
           if(!ontooltip){
             setshow(null)
           }
         },1000)
       )  
     }
     function handeltooltipenter(){  
       setontooltip(true)
     }
   
     function handeltooltipleave(){
       setontooltip(false)
       setshow('')
     }

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

    function viewsender(email){
      router.push(`/router.query.userid/${email}`)
    }

    const avatar =  <div className={classes.avatarbor}> 
                        <Badge className={frienddata.status == 'online'? classes.badge : classes.badgeoff} overlap="circular" variant="dot"></Badge>
                        <Avatar src={frienddata.photo ? frienddata.photo : ''} className={classes.avatar} width={50} height={50}>{frienddata?.name?.slice(0,1)} </Avatar> 
                    </div> 
    const allnotify = notify.map((item,index) =>{
     return <li key={index} onClick={()=>viewsender(item.email)}>{<p>{`${item.email} ${item.massagecout} massage`}</p>}</li>
    })

    const notifycount = notify.reduce((total,item)=> total + item.massages,0);
    const notifydetail = notify.map((item,index)=>{
      return <li key={index}><p>{`${item.email} : ${item.massages}massages`}</p></li>
    });

    function call(){
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((currentStream) => {
            setStream(currentStream);
            myVideo.current.srcObject = currentStream
            if(!stream){
              myVideo.current.srcObject = stream
            }
        });
        }
        setName(user.name)
        console.log(friendsocket)
        console.log(id)
        
          callUser(friendsocket)
        
        //callUser(id)
       
    }
    

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
          <div className={classes.notify} style={{display:'none'}}>
            <Badge>{notifycount > 0 ? notifycount :''}</Badge>
            <Notifications sx={{ width :20, height:20}} id='notify' color="primary" onMouseEnter={handelMouseenter} onMouseLeave={handelMouseleave}/>
            {show === 'notify' && 
            <div className={classes.notifycon} onMouseEnter={handeltooltipenter} onMouseLeave={handeltooltipleave}>
                
                   {notifycount > 0 ?
                   <ul>
                        {allnotify}
                   </ul>:
                   <p>No Notification</p>}
            
            </div>}
          </div>
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