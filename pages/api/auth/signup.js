import clientPromise from '../../../lib/mongodb'

export default async function handler(
  req,
  res
) {
    
    const client = await clientPromise;
    const db = client.db("user");
    const user = await db.collection("userdetail").findOne({email: req.body.email});

      if(user){
        res.json('User Already Exists. Try signing in')
      }else{
        await db.collection("userdetail").insertOne({email: req.body.email,password:req.body.password,name:req.body.name,friends:[],favourite:[],block:[]});
        
        res.json('User Succesfully created')
      }
}