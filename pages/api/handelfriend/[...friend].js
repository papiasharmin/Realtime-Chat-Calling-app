import clientPromise from '../../../lib/mongodb'

export default async function handler(
  req,
  res
) {
    
    const client = await clientPromise;
    const db = client.db("user");
    const chatdb = client.db("chats");
    let action = req.query.friend?.[2];
    let friend = req.query.friend?.[1].toLocaleLowerCase();
    let user = req.query.friend?.[0].toLocaleLowerCase()
    
    
    if(action == 'add'){

      const result = await db.collection("userdetail").findOne({email: friend},{email:1,block:1});

      if(result){    
        if(result.block.includes(user)){
          res.json('You Are Blocked')
        }else{
          await db.collection("userdetail").updateOne({email:user},{$addToSet:{friends:friend}})
          await db.collection("userdetail").updateOne({email:friend},{$addToSet:{friends:user}})
          await chatdb.collection('userchat').insertOne({users:[user,friend],massages:[]})
          let data = await db.collection("userdetail").findOne({email: user});
          res.json(data)
        }
      }else{
        res.json("User Doesn't Exist")
      }

    }else{
      await db.collection("userdetail").updateOne({email:user},{$pull:{friends:friend}})
      await db.collection("userdetail").updateOne({email:friend},{$pull:{friends:user}})
      await chatdb.collection('userchat').deleteOne({ users: { $all: [ user, friend ]  } })
      let data = await db.collection("userdetail").findOne({email: user});
      res.json(data)
    }

}
//{ users: { $all: [ user, friend ]  } });