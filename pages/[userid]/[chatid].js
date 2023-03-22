import Head from "next/head";
import classes from './index.module.css'
import Loading from "../../component/ui/loding";

import { useSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import clientPromise from "../../lib/mongodb";
import { useEffect,useState } from "react";
import { useRouter } from "next/router";


//const Userdash = dynamic(() => import("../../component/user/usedash"), {suspense: true,})
//const Chatcontainer = dynamic(() => import('../../component/chat/chatcontainer'), { suspense: true,})

function Chat({userdetail,frienddetail,chat}){
    const {data:session,status} = useSession()

    if(status == 'loading') return <Loading/>


    return(
        <div className={classes.chatcon}>
            <Head>
                <title>Chat with</title>
                <meta name="description" content="My Office App" />  
            </Head>
             <p>HELLO</p>

        </div>
    )
}

export default Chat;

export async function getServerSideProps({req,query,params}){

    const secret = process.env.NEXTAUTH_SECRET
    const session = await getToken({req, secret})
    
    const client = await clientPromise
    const db =  client.db('user');
    const chatdb =  client.db('chats');
    const user = await db.collection('userdetail').findOne({email:session?.email})
    const friend = await db.collection('userdetail').findOne({email: query.chatid})
    const chat = await chatdb.collection('userchat').findOne({users: { $all: [query.userid,query.chatid] }})
    
    return { props: {
      userdetail:JSON.stringify(user),
      frienddetail:JSON.stringify(friend),
      chat:JSON.stringify(chat?.massages ? chat?.massages : []),
     } }
}