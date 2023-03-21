import * as Emailvalidator from "email-validator"
import atob from 'atob'

export function base64toblob(dataurl){
    const bytestring = atob(dataurl.split(',')[1]);
     const ab = new ArrayBuffer(bytestring.length);
     const ia = new Uint8Array(ab)

     for(let i = 0; i < bytestring.length; i++){
         ia[i] = bytestring.charCodeAt(i)
     }
     return new Blob([ab],{type: 'image/jpeg'})
}

export async function sendmassagehelper(user,friend,data, datatype, dataname,username){
        
    if(!data) return ;
    
    let res = await fetch(`/api/handelmassage`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },body:JSON.stringify({
         action:'add',
         user:user,
         username:username,
         friend:friend,
         msg:{
          timestamp:Date.now(),
          writer:user,
          massage: data, 
          filetype:datatype ? datatype : '',
          filename:dataname? dataname :'',
          
         }

      })

    })
    return res.json()
  }

    export async function deletemassagehelper(user,friend,amount){
      
      let res = await fetch(`/api/handelmassage`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },body:JSON.stringify({
           action:'delete',
           user:user,
           friend:friend,
           id:amount
  
        })
  
      })
      return res.json()
   
}

export const createChathelper = async(value,userdata,action)=> {
  if(!value) return; 
  if(action === 'add') {
    if(userdata.friends.includes(value )){
        return 'Friend Already Exists'
    }  
    if(userdata.block.includes(value)){
      return 'You Have blocked This User'
    }
    
    if(Emailvalidator.validate(value)  && value != userdata.email ){

      let res = await fetch(`/api/handelfriend/${userdata.email}/${value}/${action}`)
      let data = await res.json()
      return data
         
     }else{
        return 'Invalid Input'
     }
    }else if(action == 'delete'){
      let res = await fetch(`/api/handelfriend/${userdata.email}/${value}/${action}`)
      let data = await res.json()
      return data
    }
 }

 export async function updatestatus(status){
  try{
    const res = await fetch(`/api/updatestatus`,{
      method:'POST',
      headers: {
        'Content-Type': 'application/json'
      },body:JSON.stringify({
        
        status:status,
        lastseen: Date.now(),
        
      })
    })
    const data = await res.json();
    console.log(data)

  }catch(error){
     console.log(error)
  }

}

export function gettime(date){
  let userdate = new Date(date)
  let currentdate = new Date()
  if(currentdate.getFullYear() === userdate.getFullYear() && currentdate.getMonth() === userdate.getMonth() && currentdate.getDate() === userdate.getDate()){
    return `Today ${userdate.getHours()}: ${userdate.getMinutes()} `
  }else{
    return `${userdate.toLocaleDateString()} ${userdate.getHours()}: ${userdate.getMinutes()}`
  }

}

export async function filehandeler(file,callback,type,name,){
  
  if (file.length > 0) {
    const [imageFile] = file;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const srcData = fileReader.result;
      if(type || name){
        callback(srcData,type,name)
      }else{
        callback(srcData)
      }
    }
    fileReader.readAsDataURL(imageFile);
  }  
}



