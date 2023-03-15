import { createContext, useEffect, useState } from "react";
import {useRouter} from 'next/router'

 let Usercontext = createContext({
                   userdetail:{},
                   setuser:()=>{},
                   updatefavandblock:()=>{},
                   
})

export function Userprovider(props){
    const [userdetail,setuserdetail] = useState({})
    
    async function setuser(user){
        setuserdetail(user)
    }
    
    async function updatefavandblock(action,query){
        const res= await fetch(`/api/updatefavandblock`,{
            method:'POST',
            headers: {
              'Content-Type': 'application/json'
            },body:JSON.stringify({
              action:action,
              query:query
            })
          })
          const data = await res.json()
          setuserdetail(data)
          localStorage.setItem('user',JSON.stringify(data))   
    }

    useEffect(()=>{
      if(localStorage.getItem('user')){
        setuserdetail(JSON.parse(localStorage.getItem('user')))
      }
    },[])

    useEffect(()=>{},[userdetail])
    return (
        <Usercontext.Provider value={{
                                    userdetail,
                                    setuser,
                                    updatefavandblock,
                                   
                                     }}>
            {props.children}
        </Usercontext.Provider>
    )

}

export default Usercontext;