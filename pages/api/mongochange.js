import clientPromise from '../../lib/mongodb';
import { pusher } from '../../lib/pusher';
import { getToken } from 'next-auth/jwt';

export default async function handler(
  req,
  res
) {

    const secret = process.env.NEXTAUTH_SECRET
    const session = await getToken({req, secret})

const client = await clientPromise;
const db = client.db("chats");
const userchat = db.collection("userchat");
const userdb = client.db("user");
const user= userdb.collection("userdetail");


// async function changemsg(next){ 
//   if(!next.updateDescription.updatedFields.massages && next.fullDocument?.users.includes(session.email)){ //
//       pusher.trigger("chat","newIncomingMessage",next.fullDocument);
//       console.log("received a cng MSGES COLLECTION?????: \t",next);
//   }
// }
// const changeStream = userchat.watch([],{ fullDocument: 'updateLookup' }) 
// changeStream.on("change", (next)=>changemsg(next) );

async function changenotify(next){ 
  const key = Object.keys(next.updateDescription.updatedFields)   
    if(key[0].startsWith("notification") && next.fullDocument.email == session.email){
      pusher.trigger("chat","newNotify",next.fullDocument.notification);  
      console.log("received a cng notify COLLECTION?????: \t",next); 

    }
}
const changeStream1 = user.watch(  [],{ fullDocument: 'updateLookup' }) // { $match: [{ 'fullDocument.users': session.email} }],next.updateDescription.updatedFields  
changeStream1.on("change", (next)=>changenotify(next) );
    

   
    res.json('')
}

