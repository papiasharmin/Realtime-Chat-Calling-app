import clientPromise from '../../lib/mongodb'
import { getToken } from 'next-auth/jwt';

export default async function handler(
  req,
  res
) {
  const secret = process.env.NEXTAUTH_SECRET
  const session = await getToken({req, secret})
    
    const client = await clientPromise;
    const db = client.db("user");
    const user = await db.collection("userdetail").findOne({email: req.query.getdata?.[1] ? req.query.getdata?.[1] :session.email});
   
    res.json(user)
}