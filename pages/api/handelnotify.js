import { getToken } from 'next-auth/jwt'
import clientPromise from '../../lib/mongodb'

export default async function handler(
  req,
  res
) {
    const secret = process.env.NEXTAUTH_SECRET
    const session = await getToken({req, secret})
    
    const client = await clientPromise;
    const db = client.db("user");
    await db.collection("userdetail").updateOne({email:session.email},{$pull:{notification:{email:req.body.email}} });
   
    res.json({message: "Hello, World!"})
}