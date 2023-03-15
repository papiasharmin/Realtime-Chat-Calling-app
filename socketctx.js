import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';
import { updatestatus } from './helper';

const SocketContext = createContext();

let socket 

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');
  const [id,setid] = useState()

  const userVideo = useRef();
  const connectionRef = useRef();


  const socketInitializer = async () => {   
    await fetch("/api/socket");
    socket = io();
    socket.on('me', (id) => {
        setid(id)
        setMe(id)
    });
    socket.on('callUser', ({ from, name: callerName, signal }) => {
        console.log(callerName)
      setCall({ isReceivingCall: true, from, name: callerName, signal });
      
      
    });
   
  }

  useEffect(() => { 
    socketInitializer();
  }, []);

  useEffect(()=>{
    updatestatus('',me)
  },[me])

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false,

      
      trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    console.log(id)
    const peer = new Peer({ initiator: true,
 
      trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
        console.log(currentStream)
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();
    setStream(null)
    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      setStream,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
      id
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };