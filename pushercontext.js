import { createContext, useEffect, useState,useRef } from "react";
import {useRouter} from 'next/router'
import Pusher, { Members, PresenceChannel } from "pusher-js";
import { useSession } from "next-auth/react";

let Pushercontext = createContext()

export function Pusherprovider(props){
    const {data:session,status} = useSession()
    const [username,setusername] = useState(null)
    //const [roomName, setRoomName] = useState('');
    const [notify, setnotify] = useState([]);
    const pusherRef = useRef();
    const channelRef = useRef();

    async function initiatchange(){
        await fetch(`/api/mongochange`)
    }

    useEffect(()=>{
        if(session){
            initiatchange()
        }
    },[session])

    
    useEffect(()=>{    
        if(username){
            
            pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
                authEndpoint: "/api/pusher/auth",
                auth: {
                  params: { username: username },
                },
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
                });
               channelRef.current = pusherRef.current.subscribe('chat',);
           
               channelRef.current.bind('newNotify',(doc)=>{
                    listennotify(doc);
               });

               channelcallRef.current = pusherRef.current.subscribe(`private-video`)
       
               console.log(channelRef.current)
        }
    },[username])

    async function listennotify(doc){ 
        console.log(doc)    
        setnotify(doc)
    }

    console.log(notify)
   useEffect(()=>{},[notify,username])
   
    return (
        <Pushercontext.Provider value={{
                                    initiatchange,
                                    setusername,
                                    notify,
                                  
                                     }}>
            {props.children}
        </Pushercontext.Provider>
    )

}

export default Pushercontext;

