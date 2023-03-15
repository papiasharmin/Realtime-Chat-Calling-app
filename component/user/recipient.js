
import { Avatar,Badge } from '../../node_modules/@mui/material';
import { useEffect, useState ,useContext} from "react";
import classes from './recipent.module.css'
import { useRouter } from "next/router";
import { DeleteOutline} from '@mui/icons-material';
import StarIcon from '@mui/icons-material/Star';

import Usercontext from '../../store';

function Recipient(props){
    const router = useRouter()
    const [userdata,setuserdata] = useState({})
    const userctx = useContext(Usercontext)

    async function getdetail(){
        let res = await fetch(`/api/getdata/${props.friend}`)
        let data = await res.json()       
        setuserdata(data)
    }

    useEffect(()=>{
        getdetail()
    },[])

    useEffect(()=>{},[userdata])

    const chatpage = (e)=>{      
        router.push(`/${router.query.userid}/${userdata.email}`)
    }
    
    async function delectrecipient(){
        props.deletefriend(props.friend)
        if(router.query.chatid && router.query.chatid == userdata.email){
            router.push(`/${router.query.userid}`)
        }    
    }

    useEffect(()=>{},[userctx.userdetail])

    const avatar = <div> <Badge className={userdata?.status == 'online'? classes.badge : classes.badgeoff} overlap="circular" variant="dot"/>
    <Avatar src={userdata?.photo ? userdata.photo : ''} className={classes.avatar} sx={{ width: 30, height: 30 }}>{ userdata?.name?.slice(0,1)} </Avatar>
   </div> 

    return(
       <div style={router.query.chatid == userdata?.email ? { background: '#c1d9d2' } : { background: '' }} className={classes.recipients}>
           <div onClick={chatpage}>
              {avatar}
              <span >{userdata?.name}</span>
           </div>
           <div>
           {userctx.userdetail?.favourite?.includes(userdata?.email) && <StarIcon sx={{ fontSize: 20 }} color='primary'/>}
           <DeleteOutline sx={{ fontSize: 20 }} onClick={delectrecipient}/>
           </div>
       </div>    
    )
}
export default Recipient;
