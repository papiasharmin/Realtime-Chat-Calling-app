import  {Avatar,Button} from "@mui/material";
import Massage from "./massage";
import classes from './chatcontainer.module.css'
import {useEffect, useRef, useState,useContext} from 'react'
import { deletemassagehelper,sendmassagehelper,filehandeler} from "../../helper";
import { AttachFile, EmojiEmotions, PhoneDisabled, Photo,SendRounded } from "@mui/icons-material";
import EmojiPicker from 'emoji-picker-react';
import Header from "./header";
import Cam from "./cam";
import Record from "./record";
import Pushercontext from "../../pushercontext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";


function Chatcontainer(){
    
    let [showemoji,setshowemoji] = useState(false)
    const  massageinputref = useRef();
    const fileinputref = useRef();
    const imagefileref =useRef();
    const [user,setuser] = useState(null);
    const [friend,setfriend] = useState(null);
    const [massagedata,setmassagedata] = useState(null)
    const { answerCall, callAccepted, myVideo, userVideo, callEnded, stream, call, setName, leaveCall,} = useContext(Pushercontext);
    const puserctx = useContext(Pushercontext)
    const router = useRouter()
    //const userVideo = useRef()
    async function getdata(){
        const resuser = await fetch(`/api/getdata`);
        const data1 = await resuser.json();
        const resfrnd = await fetch(`/api/getdata/${router.query.chatid}`);
        const data2 = await resfrnd.json();
        setuser(data1);
        setfriend(data2)
      }
  
      useEffect(()=>{
        getdata()
      },[router.query.chatid])

      async function getchat(user,friend){
        const res = await fetch(`/api/getmassage`,{
            method:'POST',
            headers: {
              'Content-Type': 'application/json'
            },body:JSON.stringify({
               user,
               friend
            })
          });
        const data = await res.json();
        setmassagedata(showmassage(data.massages)) 
      }

      useEffect(()=>{
        if(user && friend){
            getchat(user?.email,friend?.email)
        }
      },[user?.email,friend?.email])

      useEffect(()=>{
        if(puserctx.notify.length > 0 && puserctx.notify.find(item=> item.email  === router.query.chatid)){
            getchat(user.email,friend.email)
        }
      },[puserctx.notify])

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
    console.log(userVideo)

    function answercall(){
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((currentStream) => {
            //setStream(currentStream);
            console.log(currentStream)
            
            answerCall(currentStream)
            //myVideo.current.srcObject = currentStream
            // if(!stream){
            //   myVideo.current.srcObject = stream
            // }
        }).catch((error) =>{
          console.log(error)
        })
        }
        
       
    }
    
    const con = user && friend ?    <div className={classes.chatcon} >
            <Header frienddata={friend} user={user} deletemsg={deletemsg}/>
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
                    <video playsInline ref={userVideo} muted autoPlay  />
                    <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large" />} fullWidth onClick={leaveCall} >
                        Hang Up
                    </Button>
                </div>
              )}
            {call.isReceivingCall && !callAccepted && (
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <h1>{call.name} is calling:</h1>
              <Button variant="contained" color="primary" onClick={answercall}>
                Answer
              </Button>
              
            </div>
            )}
        
        </div> : <p>loading</p>

        return con
    
}
export default Chatcontainer;


