import  {Avatar,Button} from "../../node_modules/@mui/material";
import Massage from "./massage";
import classes from './chatcontainer.module.css'
import {useEffect, useRef, useState,useContext} from 'react'
import { deletemassagehelper,sendmassagehelper,filehandeler} from "../../helper";
import { AttachFile, EmojiEmotions, PhoneDisabled, Photo,SendRounded } from "@mui/icons-material";
import EmojiPicker from 'emoji-picker-react';
import Header from "./header";
import Cam from "./cam";
import Record from "./record";
import io from "socket.io-client";
import { SocketContext } from "../../socketctx";
import { useSession } from "next-auth/react";

let socket
function Chatcontainer({friend,user,chat}){
    
    let [showemoji,setshowemoji] = useState(false)
    const  massageinputref = useRef();
    const fileinputref = useRef();
    const imagefileref =useRef();
    const [massagedata,setmassagedata] = useState()
    const [notify,setnotify] = useState(user.notification)
    const [friendsocket,setfriendsocket] = useState(friend.socketid)
    const { answerCall, callAccepted, myVideo, userVideo, callEnded, stream, call, setName, leaveCall,} = useContext(SocketContext);
    
    useEffect(() => {    
        socketInitializer();
      }, []);
  
    const socketInitializer = async () => {   
        await fetch("/api/socket");
        socket = io();
       
        socket.on("newIncomingMessage", listen)
        socket.on("newnotify", listennotify)
        socket.on("socketidChange", (doc)=>{
            if(doc.email === friend.email){
                console.log(doc.email)
                setfriendsocket(doc.socketid)
            }
            
        } )
    }

    function listen(doc){
  
        socket.off("newIncomingMessage", listen)
        if(doc.users.includes(friend.email)){
            setmassagedata(showmassage(doc.massages))
        }
    }

    function listennotify(doc){
        socket.off("newNotify", listennotify)
        let notify = doc
        if(router.query.chatid){

          notify = doc.filter(item => item.email !== router.query.chatid);
        }
        setnotify(notify)
    }
    




    useEffect(()=>{
       
       setmassagedata(showmassage(chat))
    
     
    },[chat])

    function showmassage(msgdata){  
        return msgdata.map((massage)=>
        <Massage
        key={massage.timestamp}
        massage={massage}  
        deletemsg={deletemsg}
        avatar = { <Avatar src={massage.writer == user.email ? user.photo : friend.photo} className={classes.avatar} sx={{width:25,height:25}} >{massage.writer.slice(0,1)} </Avatar>  }
       />
      )
    }
 
    async function sendmassage(data, datatype, dataname){
        
        let res = await sendmassagehelper(user.email,friend.email,data,datatype,dataname,user.name)  
       
        setmassagedata(showmassage(res.massages))
    
    }

    function handlefile(){
       fileinputref.current.click()
    }

    function handleimagefile(){
       imagefileref.current.click()
    }

    async function handlechangefile(event){
        
       const selectedfile = event.target.files;
       filehandeler(selectedfile,sendmassage,selectedfile[0].type,selectedfile[0].name)
    
    }

    function showemojihandlar(){   
        setshowemoji(prev => !showemoji)
    }

    function handelemoji(emoji){
       sendmassage(emoji.emoji)
    }

    async function deletemsg(id){
        let res = await deletemassagehelper(user.email,friend.email,id)
        setmassagedata(showmassage(res.massages))
    }
    
    return(
        <div className={classes.chatcon} >
            <Header frienddata={friend} user={user} deletemsg={deletemsg} notify={notify} friendsocket={friendsocket}/>
            <div className={classes.massagecon} >   
                {massagedata}  
            </div>
            <div className={classes.folder}>
                <AttachFile fontSize="small" onClick={handlefile}/>
                <input type="file" accept=".txt,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" ref={fileinputref} onChange={handlechangefile}></input>
                
                <Photo fontSize="small" onClick={handleimagefile}/>
                <input type="file" accept="image/*" ref={imagefileref} onChange={handlechangefile}></input>
            
                <Cam sendmassage={sendmassage}/>
                <Record sendmassage={sendmassage}/>

                <EmojiEmotions fontSize="small" onClick={showemojihandlar}/>

            </div>
            {showemoji && <div className={classes.emoji}>
                                <EmojiPicker onEmojiClick={handelemoji}/>
                              </div>}
            <div className={classes.chatinput}>
                
                <input type='text' placeholder='Enter massage' ref={massageinputref}/>
                <Button variant="contained" endIcon={<SendRounded/>} sx={{ width :25}}  onClick={()=>sendmassage(massageinputref.current.value)}/>
                 
            </div>
        
            {callAccepted && !callEnded && (
                <div className={classes.callAccepted}>
                    <video playsInline ref={userVideo} autoPlay  />
                    <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} >
                        Hang Up
                    </Button>
                </div>
              )}
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
export default Chatcontainer;

