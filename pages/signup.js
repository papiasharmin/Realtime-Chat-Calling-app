import React,{useRef, useState,useEffect} from 'react'
import classes from './signup.module.css'
import { useRouter } from 'next/router';

import Image from 'next/image';
import { Button } from '@mui/material'

const Signup = (props) => {
  const firstnameref= useRef(null);
  const lastnameref= useRef(null);
  const emailref= useRef(null);
  const passwordref= useRef(null);
  const confirmpasswordref= useRef(null);
  const [regnotify,setregnotify] = useState('')
  const router = useRouter();
  
  const register= async (e)=> {
    e.preventDefault();
    if(confirmpasswordref.current.value !== passwordref.current.value){
      setregnotify('Passwords does not match')
      return
    }
    let data = await fetch(`/api/auth/signup`,{
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: firstnameref.current?.value + lastnameref.current?.value,
          email: emailref.current?.value,
          password: passwordref.current?.value
         }),
      })

    const res = await data.json();
    setregnotify(res)
    setTimeout(()=> {setregnotify('')
    router.push(`/login`)},4000)
    
  }



  return (

        <form  className={classes.from} onSubmit={register}>

            <Image  src={`/image/talkup.png`} alt="Picture of app logo"  width={100} height={50}/>
            <h3>Sign up for chatapp</h3>
            <div className={classes.inputs}>
                <input type='text' placeholder="First name" ref={firstnameref} required maxLength={10} minLength={3}/><br></br>
                <input type='text' placeholder="Last name" ref={lastnameref} required maxLength={10} minLength={3}/><br></br>
                <input type='email' placeholder="Email" ref={emailref} required/><br></br>
                <input type='password' placeholder="Password" ref={passwordref} required maxLength={10} minLength={3} inputmode="numeric"/><br></br>
                <input type='password' placeholder="Confirm Password" ref={confirmpasswordref}inputmode="numeric" required maxLength={10} minLength={3}/><br></br>
            </div>
            {regnotify && <p className={classes.notify}>{regnotify}</p>}
            <Button type='submit' variant="contained" className={classes.signupuser}>Sign up</Button>
            
            
        </form>
        
      
   
  )
}

export default Signup