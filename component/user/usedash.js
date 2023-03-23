import {Avatar,Button,Badge} from '@mui/material';
import classes from "./userdash.module.css"
import {useEffect, useRef, useState,useContext} from "react"
import { createChathelper, updatestatus } from '../../helper';
import Usercontext from "../../store";
import { Notifications} from "@mui/icons-material";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Pushercontext from '../../pushercontext';
import Recipient from './recipient';
import Userdashtooltip from './userdashtooltip'


function Userdash(){
    const {data:session,status} =useSession()
    const [show, setshow] = useState(null);
    const [ontooltip,setontooltip] = useState(false)
    const [time,settime] = useState();
    const chatinputref = useRef(null);
    const [userdetail,setuserdetail] = useState(null)
    const [friends,setfriends] = useState(null)
    const [modal,setmodal] = useState('')
    const [notify,setnotify] = useState(null)
    const puserctx = useContext(Pushercontext)
    const userctx = useContext(Usercontext)
    const router = useRouter()
    const notifyref = useRef()

    async function getdata(){
      await updatestatus('online')
      const res = await fetch(`/api/getdata`);
      const data = await res.json();
      setuserdetail(data);
    }

    useEffect(()=>{
      getdata()
    },[])

    useEffect(()=>{
      if(userdetail){
        setfriends(userdetail.friends);
        setnotify(userdetail.notification)
        puserctx.setusername(session.user.email)
        puserctx.initiatchange();
        localStorage.setItem('user',JSON.stringify(userdetail))
      }
    },[userdetail])

    useEffect(()=>{
      if(router.query.chatid){
        puserctx.initiatchange();
        updatenotify(router.query.chatid);
      }
    },[router.query.chatid])
  
    async function updatenotify(email){
      await fetch(`/api/handelnotify`,{
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email:email})
       })
      setnotify(prev => {
        let arr
        if(prev){
           arr = prev
          arr = arr.filter(item => item.email !== email);
        }

        return arr
     })

    }

    useEffect(()=>{
      if(puserctx.notify.length > 0){
        
        setnotify(puserctx.notify.filter(item => item.email !== userdetail?.email))
        if(!puserctx.notify.find(item => item.email == userdetail?.email)){
          let song = new Audio(`/music/notifytone1.mp3`)
          song.play()
        }
        if(router.query.chatid){
          updatenotify(router.query.chatid)
        }
      } 
    },[puserctx.notify])

    useEffect(()=>{},[friends,userctx.userdetail])

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
                          <Badge className={userdetail?.status === 'offline' ? classes.badgeof : classes.badge} ></Badge>
                          <Avatar src={userdetail?.photo ? userdetail.photo : ''} width={50} height={50} >{userdetail?.email.slice(0,1)}</Avatar>
                       </div>
    const notifycount = notify?.reduce((total,item)=> total + item.massages,0);
    const notifydetail = notify?.map((item,index)=>{
      return <li key={index} onClick={()=>modifynotify(item.email)}><p>{`${item.massages} ${item.massages >1 ? 'massages' : 'massage'} from ${item.name} `}</p></li>
    });
   
    const con = userdetail ? <div className={classes.sidebarcon}>
           <header className={classes.header}>
                <div className={classes.avatar}>
                    {useravatar}<span>{userdetail.name}</span>
                    {show === 'avatar' && 
                    
                        <Userdashtooltip path={userdetail._id} onmouseenter={handeltooltipenter} onmouseleave={handeltooltipleave}/>
                    } 
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
              {friends?.map((item,index)=>{
                   
                  return  <Recipient  key={index}  friend={item} deletefriend={deletefriend} fav={userdetail.favourite.includes(item)}/>
              }
              )}

            </div>


        </div> : <p>Loading</p>
  return con
    
}
export default Userdash;
