import clientPromise from '../../lib/mongodb'

export default async function handler(
  req,
  res
) {
    
    const client = await clientPromise;
    const db = client.db("chats");
    const allmsg = await db.collection("userchat").findOne({ users: { $all:  [ req.body.user, req.body.friend ]  } });
   
    res.json(allmsg)
}