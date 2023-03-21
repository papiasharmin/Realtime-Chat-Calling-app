import Head from "next/head";
import classes from './index.module.css'
import Loading from "../../component/ui/loding";
import dynamic from 'next/dynamic'
import { Suspense,useEffect } from 'react'
import { useSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import clientPromise from "../../lib/mongodb";
import { useRouter } from "next/router";
import Userdash from "../../component/user/usedash";



//const Userdash = dynamic(() => import("../../component/user/usedash"), {suspense: true,})
function User({userdetail}){
    const {data:session,status} = useSession()
    const router = useRouter()
    //const userctx = useContext(Usercontext)

    // if(status == 'loading'){
    //    return <Loading/>
    // }else if(!session){
    //   router.push(`/login`);
    //   return
    // }
    
    return(

        <div className={classes.chatcon}>
            <Head>
                <title>user</title>
                <meta name="description" content="My Office App" />  
            </Head>

            <Suspense fallback={`Loading...`}>
              {session && <Userdash userdetail={JSON.parse(userdetail)}/>}
            </Suspense>  
        </div>
    )
  }


export default User;

export async function getServerSideProps({req,res}){
  const secret = process.env.NEXTAUTH_SECRET
  const session = await getToken({req, secret})
  
  const client = await clientPromise
  const db =  client.db('user');

  const user = await db.collection('userdetail').findOne({email:session?.email})
  

  return { props: {
    userdetail:JSON.stringify(user)
   } }
}

// <Userdash userdetail={JSON.parse(userdetail)}/>
