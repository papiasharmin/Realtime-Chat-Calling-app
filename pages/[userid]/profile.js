import React, { FormEvent,MouseEvent,useEffect,useRef,useState } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import clientPromise from '../../lib/mongodb';
import { getToken } from 'next-auth/jwt'
import classes from './profile.module.css'
import { filehandeler } from '../../helper';
 import { useContext } from 'react';
 import Usercontext from '../../store';
 import { Button } from '@mui/material'

const Account = ({userdetail}) => {
  const {data: session, status} = useSession();
  const nameref = useRef(null);
  const passwordref = useRef(null);
  const photoref = useRef(null);
  const [userpicsrc,setuserpicsrc] = useState('')
  const router = useRouter()
  const [detail,setdetail] = useState(JSON.parse(userdetail))
  const userctx = useContext(Usercontext)

  if (status === "loading") {
    return <p>Loading...</p>
  }else if (!session) {
    router.push(`/login`)
  }
  console.log(detail)
  async function handelsubmit(e){
    e.preventDefault();
    
    let res= await fetch(`/api/auth/account`,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },body:JSON.stringify({
        name:nameref.current.value ? nameref.current.value: detail.name,
        password:passwordref.current.value ? passwordref.current.value : detail.password,
        photo:userpicsrc 
      })
    })
    let data = await res.json()
     setdetail(data)   
  }

  

  async function handlechangefile(event){
     
    const selectedfile = event.target.files;
    filehandeler(selectedfile,setuserpicsrc)    
}

async function removeblock(e){
  
  let block= e.currentTarget.previousElementSibling.innerHTML
  userctx.updatefavandblock('remove',{block:block})
}

//useEffect(()=>{setdetail(JSON.parse(userdetail))},[userctx.userdetail])

  return (
    
      <div className={classes.con}> 

          <div className={classes.detail}>
              <p className=''>Profile Detail</p>
              <div className=''>
                  <img src={`${detail.photo}`} width={100} height={100}/>
                  <p className=''>Name: {detail.name}</p>
                  <p className=''>Email: {detail.email}</p>
                  {detail?.block?.length > 0 && <><p>Block List</p>
                  <ul className={classes.block}>
                    { detail?.block?.map(item=>
                       <li><p>{item}</p><button onClick={removeblock}>Remove</button></li>
                    )
                    } 
                  </ul></>}
              </div>
          </div>
          <div className={classes.form}>

              <form onSubmit={handelsubmit}>
                
                  <label className='' htmlFor='name'>Name</label>
                  <input className={classes.input} type='text' name='text'  ref={nameref}/>
               
                  <label className='' htmlFor='password'>Change Password</label>
                  <input className={classes.input} type='password' name='password' ref={passwordref}/>
               
                  <label className='' htmlFor='photo'>Add Photo</label>
                 
                  <input type="file" className={classes.inputpic} accept="image/*" ref={photoref} onChange={handlechangefile}></input>
                  <Button type='submit' style={{alingSelf:'center',width:'200px'}} variant="contained" className=''>Submit</Button>
              </form>

          </div>
       </div>
   
  )
}

export default Account

export const getServerSideProps= async({req,res}) =>{

  const secret = process.env.NEXTAUTH_SECRET
  const session = await getToken({req,secret})
  const client = await clientPromise;
  const db = client.db("user");
  const userdetail = await db.collection("userdetail").findOne({email:session?.email});
  
  return {
       props: {userdetail:JSON.stringify(userdetail)}
  }
}