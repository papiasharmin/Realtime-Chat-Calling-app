
import Head from "next/head";
import classes from './index.module.css'
import { Suspense,useEffect } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const Userdash = dynamic(() => import("../../component/user/usedash"), {suspense: true,})

function User(){
    const {data:session,status} = useSession()
    const router = useRouter()

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
            <Suspense fallback={`loading...`}>    
              {session && <Userdash/>} 
            </Suspense>             
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

