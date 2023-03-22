import {Avatar,Button,Badge} from '@mui/material';
import classes from "./userdash.module.css"
import {useEffect, useRef, useState,useContext} from "react"
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { createChathelper } from '../../helper';
import Usercontext from "../../store";
import { Notifications} from "@mui/icons-material";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Pushercontext from '../../pushercontext';
import Recipient from './recipient';
import Userdashtooltip from './userdashtooltip'

// const Recipient = dynamic(() => import('./recipient'), {suspense: true,})
// const Userdashtooltip = dynamic(() => import('./userdashtooltip'), {suspense: true,})

function Userdash(){
    const {data:session,status} =useSession()
    const [show, setshow] = useState(null);
    const [ontooltip,setontooltip] = useState(false)
    const [time,settime] = useState();
    const chatinputref = useRef(null);
    const [friends,setfriends] = useState()
    const [modal,setmodal] = useState('')
    const [notify,setnotify] = useState()
    const puserctx = useContext(Pushercontext)
    const userctx = useContext(Usercontext)
    const router = useRouter()
  
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
        updatenotify(router.query.chatid);
        puserctx.setfriendemail(router.query.chatid)
      }
    },[router.query.chatid])

    // useEffect(()=>{
    //   console.log('PROBLEMDETECTED')
    //   puserctx.setusername(userdetail.email); 
    //   localStorage.setItem('user',JSON.stringify(userdetail))
    // },[])

    // useEffect(()=>{
    //   if(puserctx.notify.length > 0){
    //     setnotify(puserctx.notify)
    //   }
     
    // },[puserctx.notify])

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

    // const useravatar = <div className={classes.avatarbor} id='avatar' onMouseEnter={handelMouseenter} onMouseLeave={handelMouseleave}>
    //                       <Badge className={userdetail.status === 'offline' ? classes.badgeof : classes.badge} ></Badge>
    //                       <Avatar src={userdetail.photo ? userdetail.photo : ''} width={50} height={50} >{userdetail.email.slice(0,1)}</Avatar>
    //                    </div>
    // const notifycount = notify.reduce((total,item)=> total + item.massages,0);
    // const notifydetail = notify.map((item,index)=>{
    //   return <li key={index} onClick={()=>modifynotify(item.email)}><p>{`${item.massages} ${item.massages >1 ? 'massages' : 'massage'} from ${item.name} `}</p></li>
    // });
   
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


        </div>
    )
}
export default Userdash;
