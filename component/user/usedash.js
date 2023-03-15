import {Avatar,Button,Badge} from '../../node_modules/@mui/material';
import classes from "./userdash.module.css"
import {useEffect, useRef, useState,useContext} from "react"
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { createChathelper } from '../../helper';
import Usercontext from "../../store";
import { Notifications} from "@mui/icons-material";
import io from "socket.io-client";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SocketContext } from '../../socketctx';

const Recipient = dynamic(() => import('./recipient'), {suspense: true,})
const Userdashtooltip = dynamic(() => import('./userdashtooltip'), {suspense: true,})

let socket
function Userdash({userdetail}){
    const {data:session,status} =useSession()
    const [show, setshow] = useState(null);
    const [ontooltip,setontooltip] = useState(false)
    const [time,settime] = useState();
    const chatinputref = useRef(null);
    const [friends,setfriends] = useState(userdetail.friends)
    const [modal,setmodal] = useState('')
    const [notify,setnotify] = useState(userdetail.notification)
    const userctx = useContext(Usercontext)
    const router = useRouter()
    const { answerCall, call, callAccepted } = useContext(SocketContext);//

    useEffect(() => {    
      socketInitializer();
    }, []);

    async function updatenotify(email){
      await fetch(`/api/handelnotify`,{
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email:email})
       })
      setnotify(prev => {
        let arr = prev
        arr = arr.filter(item => item.email !== email);
        return arr
     })

    }

    useEffect(()=>{
      if(router.query.chatid){
        updatenotify(router.query.chatid)
      }
    },[router.query.chatid])

    const socketInitializer = async () => {   
      await fetch("/api/socket");
      socket = io();
     
      socket.emit("newuser",session)
      socket.on("newNotify", listennotify)
    }

    function listennotify(doc){
      socket.off("newNotify", listennotify)
      let notify = doc
      if(router.query.chatid){
        notify = doc.filter(item => item.email !== router.query.chatid);
      }
      setnotify(notify)
    }

    const addfriend = async()=> {
        
       const input = chatinputref.current.value;
        if (!input) {
          setmodal('Enter Email')
          return};
        let res = await createChathelper(input,userdetail,'add')
        
        if(typeof res === 'string'){
          setmodal(res)
        }else{
           setfriends(res.friends)
          
        }    
    }

    useEffect(()=>{},[friends,userctx.userdetail])

    const deletefriend = async(friend)=> {   
        let res = await createChathelper(friend,userdetail,'delete')
          setfriends(res.friends)    
    }

    function handelMouseenter(event){  
      setshow(event?.currentTarget.id)
    }
     
    function handelMouseleave(){ 
      settime(setTimeout(()=>{    
          if(!ontooltip){
             setshow(null)
          }
        },1000))  
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
    
    async function modifynotify(email){
      updatenotify(email)
       router.push(`/${router.query.userid}/${email}`)
    }

    const useravatar = <div className={classes.avatarbor} id='avatar' onMouseEnter={handelMouseenter} onMouseLeave={handelMouseleave}>
                          <Badge className={userdetail.status === 'offline' ? classes.badgeof : classes.badge} ></Badge>
                          <Avatar src={userdetail.photo ? userdetail.photo : ''} width={50} height={50} >{userdetail.email.slice(0,1)}</Avatar>
                       </div>
    const notifycount = notify.reduce((total,item)=> total + item.massages,0);
    const notifydetail = notify.map((item,index)=>{
      return <li key={index} onClick={()=>modifynotify(item.email)}><p>{`${item.massages} ${item.massages >1 ? 'massages' : 'massage'} from ${item.name} `}</p></li>
    });
   
    return(
        <div className={classes.sidebarcon}>
           <header className={classes.header}>
                <div className={classes.avatar}>
                    {useravatar}<span>{userdetail.name}</span>
                    {show === 'avatar' && 
                    <Suspense fallback={`Loading...`}>
                        <Userdashtooltip path={userdetail._id} onmouseenter={handeltooltipenter} onmouseleave={handeltooltipleave}/>
                    </Suspense>} 
                </div>
                <div>
                    {notifycount > 0  && <div className={classes.badgenotify}><span>{notifycount}</span></div>}
                    <Notifications sx={{ width :25, height:25}} id='notify' color="primary" onMouseEnter={handelMouseenter} onMouseLeave={handelMouseleave}/>      
                    {show === 'notify' && 
                    <div className={classes.notifycon} onMouseEnter={handeltooltipenter} onMouseLeave={handeltooltipleave}>
                        {notifycount > 0 ?
                        <>
                        <p>You have :</p>
                        <ul>
                          
                            {notifydetail}
                        </ul>
                        </>:
                        <p>No Notification</p>}
                    </div>
                    }
                </div> 
           </header>
           
           <div className={classes.searchinput}>     
                <input id='chatinput' className={classes.chatinput} type='text' placeholder='Search Friends' ref={chatinputref}></input>
           </div>

           <Button variant="contained" className={classes.button}  onClick={addfriend}>Find Friend</Button>
            {modal  &&  <div className={classes.modal}>
                              <p>{modal}</p>
                              <button onClick={()=>setmodal('')}>close</button>
                          </div>
            }
            <div className={classes.recipientcon}>
              <p>Your Friends</p>
              {friends?.map((item,index)=>
                <Suspense key={index} fallback={`Loading...`}>
                    <Recipient  key={index}  friend={item} deletefriend={deletefriend} fav={userdetail.favourite.includes(item)}/>
                </Suspense>    
              )}

            </div>

            {call.isReceivingCall && !callAccepted && (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <h1>{call.name} is calling:</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </div>
            )}

        </div>
    )
}
export default Userdash;
