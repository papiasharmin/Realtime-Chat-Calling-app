
import { Server } from "socket.io";
import clientPromise from "../../lib/mongodb";

export default async function SocketHandler(req, res) {
  
  const client = await clientPromise;
  const db = client.db("chats");
  const userchat = db.collection("userchat");
  const userdb = client.db("user");
  const user= userdb.collection("userdetail");
  let session;
  
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  async function changemsg(next){ 
    if(!next.updateDescription.updatedFields.massages && next.fullDocument?.users.includes(session.user.email)){ //
        io.emit("newIncomingMessage",next.fullDocument);
        console.log("received a cng MSGES COLLECTION?????: \t",next);
    }
  }

  const changeStream = userchat.watch([],{ fullDocument: 'updateLookup' }) // { $match: [{ 'fullDocument.users': session.email} }],next.updateDescription.updatedFields   
  changeStream.on("change", (next)=>changemsg(next) );

  async function changenotify(next){  
    const key = Object.keys(next.updateDescription.updatedFields)
     
      if(key[0].startsWith("notification") && next.fullDocument.email == session.user.email){
        io.emit("newNotify",next.fullDocument.notification);
        
        console.log("received a cng notify COLLECTION?????: \t",next); 

      }else if(key[0] == 'socketid' ){
         io.emit('socketidChange',next.fullDocument)
         console.log("received a cng notify COLLECTION?????: \t",next); 
      }

  }



  const changeStream1 = user.watch(  [],{ fullDocument: 'updateLookup' }) // { $match: [{ 'fullDocument.users': session.email} }],next.updateDescription.updatedFields  
  changeStream1.on("change", (next)=>changenotify(next) );

  const onConnection = (socket) => {

    socket.on("newuser", async (sessiondetail) =>{       
         session = sessiondetail   
    });

    socket.emit("me", socket.id);

    socket.on("disconnect", () => {
      socket.broadcast.emit("callEnded")
    });
  
    socket.on("callUser", ({ userToCall, signalData, from, name }) => {
      console.log(signalData)
      io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    });
  
    socket.on("answerCall", (data) => {
      io.to(data.to).emit("callAccepted", data.signal)
    });
    
  };

  io.on("connection", onConnection);

  console.log("Setting up socket");
  res.end();
}