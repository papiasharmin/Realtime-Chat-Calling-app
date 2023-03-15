import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb'

export default async function handler(
  req,
  res
) {  
    const client = await clientPromise;
    const db = client.db("chats");
    const userchat = db.collection("userchat");
    const userdb = client.db("user")
  
    if(req.body.action == 'add'){
        await userchat.updateOne( { users: { $all: [req.body.user, req.body.friend] }},{$push:{massages:{_id:new ObjectId(),...req.body.msg}}})
        const note = await userdb.collection("userdetail").findOne({email:req.body.friend ,"notification.email":req.body.user});
        
        if(note){ 
            await userdb.collection("userdetail").updateOne({email:req.body.friend ,"notification.email":req.body.user},{$inc:{"notification.$.massages":1} });
        }else{
            await userdb.collection("userdetail").updateOne({email:req.body.friend },{$push:{notification:{email:req.body.user,name:req.body.username,massages:1}} });
           
        }
        
    }else if(req.body.action == 'delete'){
        if(req.body.id){
        await userchat.updateOne( { users: { $all: [req.body.user, req.body.friend] }},{$pull:{massages:{_id:new ObjectId(req.body.id)}}})
        }else{
        await userchat.updateOne( { users: { $all: [req.body.user, req.body.friend] }},{$set:{massages:[]}})   
        }
    }

    const allmsg = await userchat.findOne({ users: { $all: [req.body.user, req.body.friend] }});    
    res.json(allmsg)
}

