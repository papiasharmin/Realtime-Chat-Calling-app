import clientPromise from '../../lib/mongodb'
import { getToken } from 'next-auth/jwt'

export default async function handler(
  req,
  res
) {
    const secret = process.env.NEXTAUTH_SECRET
    const session = await getToken({req, secret})
    
    const client = await clientPromise;
    const db = client.db("user");

    if(req.body.action == 'add'){
        await db.collection("userdetail").updateOne({email:session.email},{$addToSet:req.body.query})
    }else{
        await db.collection("userdetail").updateOne({email:session.email},{$pull:req.body.query})
    }
    const user = await db.collection("userdetail").findOne({email:session.email})
    
    res.json(user)
}