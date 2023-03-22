import classes from './massage.module.css'
import Image from 'next/image';
import { useRouter } from 'next/router';
import { gettime } from '../../helper';
import { DeleteOutline, FileDownloadOutlined,} from '@mui/icons-material';
import { useEffect,useRef } from 'react';

function Massage(props){
    const router = useRouter()
    const bottomref = useRef();

    useEffect(()=>{
        bottomref.current?.scrollIntoView({behavior: "smooth", block: "end",});
    },[])
    
    const filetype = props.massage.filetype.slice('/').includes('image') ? 
    <Image src={props.massage.massage} width={120} height={120}/>: 
    props.massage.filetype.slice('/').includes('audio') ? 
    <audio controls src={props.massage.massage} width={120} height={120}/> : 
    <span className={classes.filename}>{props.massage.filename}</span>
    
    const dismassage = props.massage.filetype || props.massage.filename ? 
                        <div className={classes.file}>
                            <a href={props.massage.massage} download>
                                <FileDownloadOutlined size="small" color="disabled"/>{filetype}
                            </a>
                        </div> : 
                        <p className={props.massage.user === router.query.userid? classes.massageu : classes.massage}>{props.massage.massage}</p>
    return(
        <>
            <div className={props.massage.writer === router.query.userid? classes.massageconu : classes.massagecon}>
                <div>
                    <div style={props.massage.writer !== router.query.userid?{display:'flex',alignItems:'center'}:{display:'flex',alignItems:'center',flexDirection:'row-reverse'}}>
                        {props.avatar}
                        {dismassage}
                    </div>
                    <span className={classes.time}>{gettime(props.massage.timestamp)}</span>
                </div>
                
                <DeleteOutline sx={{ fontSize: 20 }} onClick={()=> props.deletemsg(props.massage._id)}/>
                <div ref={bottomref}></div> 
            </div>
            
        </>
    )
}
export default Massage;
//<div ref={props.bottom}></div>