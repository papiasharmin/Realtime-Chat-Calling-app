import {Stack,Button} from '../../node_modules/@mui/material';
import classes from './chatcontooltip.module.css'
import { createChathelper } from '../../helper';
import { useState } from 'react';
import { useContext } from "react";
import Usercontext from "../../store";
import { useRouter} from 'next/router';

function Chatcontooltip({onmouseenter,onmouseleave,user,friendemail,deletemsg}){
    const userctx = useContext(Usercontext)
    const [favstate,setfavsate] = useState(userctx.userdetail?.favourite?.includes(friendemail)? 'Remove': 'Add')
    const router = useRouter()

    async function clearchat(){
       deletemsg('')
    }

    async function addfav(){
        if(favstate === 'Add'){              
            userctx.updatefavandblock('add',{favourite:friendemail})
            setfavsate('Remove')
        }else{      
            userctx.updatefavandblock('remove',{favourite:friendemail})
            setfavsate('Add')
        }
    }

    async function addblock(){
       const res = await createChathelper(friendemail,user,'delete')
       userctx.setuser(res)
       userctx.updatefavandblock('add',{block:friendemail})
       router.push(`/${router.query.userid}`)
    }

    return(
        <div className={classes.tooltip} onMouseEnter={onmouseenter} onMouseLeave={onmouseleave}>
            <Stack direction="column">
            
              <Button variant="outlined" size="small" onClick={clearchat}>Clear History</Button>
            
              <Button variant="outlined" size="small" onClick={addfav}>{favstate} Favoirite</Button>

              <Button variant="outlined" size="small" onClick={addblock}>Block</Button>            

            </Stack>
        </div>
    )
}
export default Chatcontooltip;

