import clientPromise from '../../lib/mongodb'

export default async function handler(
  req,
  res
) {
    
    const client = await clientPromise;
    const db = client.db("user");
    const user = await db.collection("userdetail").findOne({email: req.query.getdata[1]});
   
    res.json(user)
}