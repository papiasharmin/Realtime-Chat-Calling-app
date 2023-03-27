import { createContext, useEffect, useState,useRef } from "react";
import {useRouter} from 'next/router'
import Pusher, { Members, PresenceChannel } from "pusher-js";
import { useSession } from "next-auth/react";

let Pushercontext = createContext()

export function Pusherprovider(props){
    const {data:session,status} = useSession()
    const [username,setusername] = useState(null)
    const [answered, setanswered] = useState(false);
    const [myvideo, setmyvideo] = useState(null);
    const [friendvideo, setfriendvideo] = useState(null);
    const [notify, setnotify] = useState([]);
    const pusherRef = useRef();
    const channelRef = useRef();
    

    async function initiatchange(email){
        await fetch(`/api/mongochange`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },body:JSON.stringify({
               email:email
      
            })
      
          }

        )
    }

    // useEffect(()=>{
    //     if(session){
    //         initiatchange()
    //     }
    // },[session])
    let usersOnline, id, users = [],
    sessionDesc,
    currentcaller, room, caller, localUserMedia;

    
    useEffect(()=>{ 
        console.log(username)   
        if(username){
            initiatchange(username)
            pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
                authEndpoint: "/api/pusher/auth",
                auth: {
                  params: { username: username },
                },
                
                cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
                });
               channelRef.current = pusherRef.current.subscribe('presence-chat');
           
               channelRef.current.bind('newNotify',(doc)=>{
                    listennotify(doc);
               });

               //channelRef.current = pusherRef.current.subscribe('private-videocall');

              channelRef.current.bind('pusher:subscription_succeeded', (data) => {
               
                prepareCaller();
            })

            // GetRTCPeerConnection();
            // GetRTCSessionDescription();
            // GetRTCIceCandidate();
            

                // //Listening for the candidate message from a peer sent from onicecandidate handler
    channelRef.current.bind("client-candidate", function(msg) {
       
        if(true){//msg.room==room
            console.log("candidate received");
            console.log(msg.candidate);
            
            caller.addIceCandidate(new RTCIceCandidate(msg.candidate));
            console.log(caller)
        }
    });

    //Listening for Session Description Protocol message with session details from remote peer
    channelRef.current.bind("client-sdp", function(msg) {
        console.log(`${msg.room}${room}${msg.room==room}`)
        //prepareCaller()
        if(true){ //msg.room == username
            
            console.log("sdp received");
            var answer = confirm("You have a call from: "+ msg.from + "Would you like to answer?");//answer call chage
            if(!answer){
                return channelRef.current.trigger("client-reject", {"room": msg.room, "rejected":id});
            }
            setanswered(true)
            room = msg.room;
            getCam()
                .then(stream => {
                    console.log(stream)
                    localUserMedia = stream;
                    toggleEndCallButton();
                    // if (window.URL) {
                    //     //document.getElementById("selfview").srcObject = evt.stream;
                    // } else {
                    //    // document.getElementById("selfview").src = stream;
                    // }
                    if (stream) {
                        console.log(stream)
                       // myvideo.current.srcObject = stream
                     }

                    caller.addStream(stream);
                    console.log(msg.sdp)
                    let sessionDesc = new RTCSessionDescription(msg.sdp);

                    caller.setRemoteDescription(sessionDesc);
                    caller.createAnswer().then(function(sdp) {
                        caller.setLocalDescription(new RTCSessionDescription(sdp));
                        channelRef.current.trigger("client-answer", {
                            "sdp": sdp,
                            "room": room
                        });
                    });

                })
                .catch(error => {
                    console.log('an error occured', error);
                })
        }
        

    });
            channelRef.current.bind("client-answer", function(answer) {
                if(true){//answer.room==room
                    console.log("answer received");
                    caller.setRemoteDescription(new RTCSessionDescription(answer.sdp));
                }
                
            });
        
            channelRef.current.bind("client-reject", function(answer) {
                if(true){//answer.room==room
                    console.log("Call declined");
                    alert("call to " + answer.rejected + "was politely declined");
                    endCall();
                }
                
            });
        
            channelRef.current.bind("client-endcall", function(answer) {
                if(answer.room==room){
                    console.log("Call Ended");
                    endCall();
                    
                }
                
            });
            
  
       
            
        }
    },[username])

    async function listennotify(doc){ 
        console.log(doc)    
        setnotify(doc)
    }

  
    function prepareCaller(){
        //Initializing a peer connection
        caller = new window.RTCPeerConnection();
        //Listen for ICE Candidates and send them to remote peers
        console.log(caller)
        caller.onicecandidate = function(evt) {
            if (!evt.candidate) return;
            console.log("onicecandidate called");
            onIceCandidate(caller, evt);
        };
        //onaddstream handler to receive remote feed and show in remoteview video element
        caller.onaddstream = function(evt) {
            console.log("onaddstream called");
            friendvideo.current.srcObject = evt.stream
        };
    }
    function getCam() {
        //Get local audio/video feed and show it in selfview video element 
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            
        let strem =  navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        console.log(strem)
        return strem
    }
    }

    // function GetRTCIceCandidate() {
    //     window.RTCIceCandidate = window.RTCIceCandidate //|| window.webkitRTCIceCandidate ||
    //         //window.mozRTCIceCandidate || window.msRTCIceCandidate;

    //     return window.RTCIceCandidate;
    // }

    // function GetRTCPeerConnection() {
    //      window.RTCPeerConnection = window.RTCPeerConnection //|| window.webkitRTCPeerConnection ||
    //     //     window.mozRTCPeerConnection || window.msRTCPeerConnection;
    //     return window.RTCPeerConnection;
    // }

    // function GetRTCSessionDescription() {
    //     window.RTCSessionDescription = window.RTCSessionDescription //|| window.webkitRTCSessionDescription ||
    //         //window.mozRTCSessionDescription || window.msRTCSessionDescription;
    //     return window.RTCSessionDescription;
    // }

    function callUser(user,myvideo) {
       prepareCaller()
        getCam()
            .then(stream => {
                if (stream) {
                    myvideo.current.srcObject = stream
                 }
                
                toggleEndCallButton();
                caller.addStream(stream);
                localUserMedia = stream;
                caller.createOffer().then(function(desc) {
                    console.log(desc)
                    caller.setLocalDescription(new RTCSessionDescription(desc));
                    channelRef.current.trigger("client-sdp", {
                        "sdp": desc,
                        "room": user,
                        "from": username
                    });
                    room = user;
                });

            })
            .catch(error => {
                console.log('an error occured', error);
            })
    };

    function endCall(){
        room = undefined;
        caller.close();
        for (let track of localUserMedia.getTracks()) { track.stop() }
        prepareCaller();
        toggleEndCallButton();

    }

    function endCurrentCall(){
        
        channel.trigger("client-endcall", {
                "room": room
            });

        endCall();
    }

    // //Send the ICE Candidate to the remote peer
    function onIceCandidate(peer, evt) {
        if (evt.candidate) {
            console.log(evt.candidate)
            channelRef.current.trigger("client-candidate", {
                "candidate": evt.candidate,
                "room": room
            });
        }
    }

    function toggleEndCallButton(){
        // if(document.getElementById("endCall").style.display == 'block'){
        //     document.getElementById("endCall").style.display = 'none';
        // }else{
        //     document.getElementById("endCall").style.display = 'block';
        // }
    }


    //Listening for answer to offer sent to remote peer


    console.log(notify)
   useEffect(()=>{},[notify,username])
   
    return (
        <Pushercontext.Provider value={{
                                    initiatchange,
                                    setusername,
                                    setmyvideo,
                                    setfriendvideo,
                                    callUser,
                                    // endCurrentCall,
                                    notify,
                                    answered
                                  
                                     }}>
            {props.children}
        </Pushercontext.Provider>
    )

}

export default Pushercontext;

