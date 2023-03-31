import {Stack,Button} from '../../node_modules/@mui/material';
import classes from './userdashtooltip.module.css'
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react'
import { updatestatus } from '../../helper';

function Userdashtooltip(props){
    const router = useRouter()
    const {data:session,status } = useSession()
   
    function showaccount(){
        router.push(`/${props.path}/profile`)
    }

    async function handelsignout(){
        await updatestatus('offline')
        localStorage.removeItem('user')
        await signOut({ callbackUrl: 'https://main--fluffy-tartufo-80899b.netlify.app/login' })  
    }

    return(
        <div className={classes.tooltip} onMouseEnter={props.onmouseenter} onMouseLeave={props.onmouseleave}>
            <Stack direction="column">
            
              <Button variant="outlined" size="small" onClick={showaccount}>Profile</Button>
            
              <Button variant="outlined" size="small" onClick={handelsignout}>Logout</Button>              

            </Stack>
        </div>
    )
}
export default Userdashtooltip;
