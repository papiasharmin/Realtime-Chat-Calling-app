
import Head from "next/head";
import classes from './index.module.css'
import Loading from "../../component/ui/loding";
import { Suspense,useEffect } from 'react'
import { useSession } from "next-auth/react";
//import { getToken } from "next-auth/jwt";
//import clientPromise from "../../lib/mongodb";
import { useRouter } from "next/router";
import Userdash from "../../component/user/usedash";


function User(){
    const {data:session,status} = useSession()
    const router = useRouter()
    //const userctx = useContext(Usercontext)

    if (status === "loading") {
      return <p>Loading...</p>
    }else if (!session) {
      router.push(`/login`)
    }
    
    return(

        <div className={classes.chatcon}>
            <Head>
                <title>user</title>
                <meta name="description" content="My Office App" />  
            </Head>

            
              {session && <Userdash/>}
             
        </div>
    )
  }


export default User;

// export const getServerSideProps= async({req,res}) =>{

//   const secret = process.env.NEXTAUTH_SECRET
//   const session = await getToken({req,secret})
//   const client = await clientPromise;
//   const db = client.db("user");
//   const userdetail = await db.collection("userdetail").findOne({email:session?.email});
  
//   return {
//        props: {userdetail:JSON.stringify(userdetail)}
//   }
// }

// <Userdash userdetail={JSON.parse(userdetail)}/>

