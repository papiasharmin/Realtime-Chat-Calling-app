import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Usercontext from '../store';
import { useContext } from 'react';

export default function Home() {

   const {data:session,status} = useSession()
   const router = useRouter();
   const userctx = useContext(Usercontext)

   if(status == 'loading'){
    return <p>..LODING</p>
   }else if(!session){
      console.log('LOOOOOGIIII')
     router.push(`/login`)
   }else if(session){  
      //let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) :{}
      router.push(`/${session.user.email}`)
   }
}




