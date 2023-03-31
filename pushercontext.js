import { createContext, useEffect, useState,useRef } from "react";
import Pusher from "pusher-js";
import { useSession } from "next-auth/react";
import Peer from 'simple-peer';

let Pushercontext = createContext()

export function Pusherprovider(props){
    const {data:session,status} = useSession()
    const [username,setusername] = useState(null)
    const [notify, setnotify] = useState([]);
    const pusherRef = useRef();
    const channelRef = useRef();
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState(null);
    const [call, setCall] = useState({});
    const userVideo = useRef();
    const connectionRef = useRef();
    
    async function initiatchange(email){
        await fetch(`/api/mongochange`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },body:JSON.stringify({
               email:email
            })
          })
    }

    useEffect(()=>{ 
         
        if(username){
            initiatchange(username);
            
            pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, 
                { authEndpoint:"/api/pusher/auth",   
                  auth: {
                    params: { username: username },
                   } ,
                   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
                });
               channelRef.current = pusherRef.current.subscribe('presence-chat');
               console.log(channelRef.current)
               
               channelRef.current.bind('client-newNotify',(doc)=>{
                    listennotify(doc);
               });

               channelRef.current.bind('client-callUser', (data) => {
                  console.log(data) 
                  if(data.userToCall === username){
                    setCall({ isReceivingCall: true, from:data.from, signal:data.signalData, name:data.name, type:data.type }); 
                  } 
               });

              channelRef.current.bind('client-calloff',({msg})=>{
                    console.log(msg)
                    setCall({})
              })
            
        }
    },[username])

    async function listennotify(doc){ 
        console.log(doc)    
        setnotify(doc)
    }

    const answerCall = (stream) => {
        setCallAccepted(true);
  
        const peer = new Peer({ initiator: false, trickle: false, stream });
        console.log(stream)

        peer.on('signal', (data) => {
            console.log(data)

            channelRef.current.trigger('client-answerCall', { signal: data, to: call.from });
        });

        peer.on('error',(error)=>{
          console.log(error)
        })
        peer.on('connect',()=>{
          console.log('connect')
        })
        peer.on('close', () => {
          console.log('close')
          //leaveCall()
        })
     
    
        peer.on('stream', (currentStream) => {
            console.log(currentStream)
            userVideo.current.srcObject = currentStream;
            
        });

        peer.signal(call.signal);
        connectionRef.current = peer;
        console.log(connectionRef.current)

      };
    
      const callUser = (id,stream,name,type) => {
        console.log(id)
        const peer = new Peer({ initiator: true, trickle: false, stream });
        console.log(stream)
        peer.on('signal', (data) => {
          console.log(data)
          channelRef.current.trigger('client-callUser', { userToCall: id, signalData:data, from:username, name:name, type:type });
         
        });
    
        peer.on('stream', (currentStream) => {
          console.log(currentStream)
          userVideo.current.srcObject = currentStream;
  
        });

        peer.on('error',(error)=>{
          console.log(error)
        })
        channelRef.current.bind('client-reject',({msg})=>{
          console.log(msg)
          connectionRef.current.destroy()
        })
        peer.on('connect',()=>{
          console.log('connect')
        })
        peer.on('close', () => {
          console.log('close')
          //leaveCall()

        })
    
        channelRef.current.bind('client-answerCall', (data) => {
            console.log(data)
            setCallAccepted(true);
    
            peer.signal(data.signal);
        });
    
        connectionRef.current = peer;
        console.log(connectionRef.current)
      };

      const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy();
        //setStream(null)
        window.location.reload();
        
      };
      const rejectCall = ()=>{
        console.log('dont recive')
        setCall({})
        channelRef.current.trigger('client-reject',{msg:'call rejected'})

      }

      const calloff = ()=>{
        channelRef.current.trigger('client-calloff',{msg:'call canceled'})
      }


   
   //console.log(userVideo)
   useEffect(()=>{},[notify,username])
   
    return (
        <Pushercontext.Provider value={{
                                    setusername,
                                    notify,
                                    call,
                                    callAccepted,
                                    userVideo,
                                    callEnded,
                                    calloff,
                                    rejectCall,
                                    callUser,
                                    leaveCall,
                                    answerCall,
                                     }}>
            {props.children}
        </Pushercontext.Provider>
    )

}

export default Pushercontext;

