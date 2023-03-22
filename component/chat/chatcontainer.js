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


function Chatcontainer({friend,user,chat}){
    
    let [showemoji,setshowemoji] = useState(false)
    const  massageinputref = useRef();
    const fileinputref = useRef();
    const imagefileref =useRef();
    const [massagedata,setmassagedata] = useState()
    const puserctx = useContext(Pushercontext)

    useEffect(()=>{
        setmassagedata(showmassage(puserctx.newmsg))
    },[puserctx.newmsg])

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
        
        </div>
    )
}
export default Chatcontainer;

