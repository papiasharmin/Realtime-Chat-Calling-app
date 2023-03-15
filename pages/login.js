import React,{ useRef, useState} from 'react'
import {signIn} from 'next-auth/react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { updatestatus } from '../helper'
import Head from 'next/head'
import classes from './login.module.css'
import Image from 'next/image'
import { Button } from '@mui/material'
import Usercontext from '../store'
import { useContext } from 'react'
import { useEffect } from 'react'
import { SocketContext } from '../socketctx'
// import { useEffect } from 'react'

const Login = ({userdetail}) => {
  
  const { data: session, status } = useSession()
  const logemailref= useRef(null);
  const logpasswordref= useRef(null);
  const [notify,setnotify] = useState('')
  const router = useRouter()
  const userctx = useContext(Usercontext)
  const {me} = useContext(SocketContext)

  const login = async (e)=>{
    e.preventDefault();

    const result = await signIn('credentials',{
      redirect:false,
      email: logemailref.current?.value,
      password: logpasswordref.current?.value
    })
    
    if(!session){

      
    
      setnotify(result?.error ? result?.error: '' )
      setTimeout(()=> setnotify(''),4000)
    }  
  }

  function signup(){
    router.push(`/signup`)
  }

  async function getdata(){
    
    await updatestatus('online',me)
    let user = await fetch(`/api/getdata/${session.user.email}`)
    let userdetail = await user.json()
    localStorage.setItem('user',JSON.stringify(userdetail))
    router.push(`/${session.user.email}`)

  }

  useEffect(()=>{
    if(session){
      console.log(session)
      getdata()
      

    }

  },[session])

  return (
    <>
          <Head>
              <title>Loginpage</title>
              <meta name="description" content="My Office chat App" />
          </Head>
          <div className={classes.log}>
            <Image className={classes.img} src={`/image/talkup.png`} alt="Picture of app logo" width={100} height={50} />

            <form className={classes.inputs} onSubmit={login} >
                <input type='email' placeholder='Enter Email' ref={logemailref}  required/><br></br>
                <input type='text' placeholder='Password' ref={logpasswordref} required inputMode='numeric' maxLength={10} minLength={3}/><br></br>
                {notify && <p className={classes.notify}>{notify}</p>}
                <Button type='submit' variant="contained">Login</Button>
            </form>

            <Button size="small" className={classes.signup} onClick={signup}>Don't have a account? Sign up</Button>         
          </div>
          
    </>
  )
}

export default Login

// export async function getServerSideProps({req,res}) {

//   const secret = process.env.NEXTAUTH_SECRET
//   const session = await getToken({req, secret})
  
//   const client = await clientPromise
//   const db =  client.db('user');
//   const user = await db.collection('userdetail').findOne({email:session?.email},{_id:1})
  
//   return { props: {
//     userdetail:JSON.stringify(user)
//    } }
// }