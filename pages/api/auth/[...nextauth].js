
import NextAuth from "next-auth"
import clientPromise from '../../../lib/mongodb'
import CredentialsProvider from "next-auth/providers/credentials"


export const authOptions = {
  session: { strategy: "jwt" },
  secret : process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      
     // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email Address", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
       
        const client = await clientPromise;
        const user = await client.db("user").collection('userdetail').findOne({email:credentials.email})
        
        if (user) {
          if(credentials.password !== user.password){
            
            throw new Error("Wrong Password, Try Again!")
            //client.close()
          }else{
            //client.close()
            return {email: user.email}
          }
        } else {
          
          throw new Error("No User Found!, You Must Register First.") 
          
        }
      }
    })
  ]

}
  


export default NextAuth(authOptions)