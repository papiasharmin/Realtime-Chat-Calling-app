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
      
     router.push(`/login`)
   }else if(session){  
      
      router.push(`/${session.user.email}`)
   }
}




