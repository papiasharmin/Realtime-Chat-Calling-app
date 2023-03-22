/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env:{
      mongodb_user: 'papiasharmin33',
      mongodb_pass: 'KHreQLMHHtXVRdQj',
      mongodb_cluster: 'cluster0',
      NEXTAUTH_URL:'http://localhost:3000',
      NEXTAUTH_SECRET: 'papiasharim25121991',
      PUSHER_APP_ID : "1563681",
      PUSHER_KEY : "914188472a2b75114ad5",
      NEXT_PUBLIC_PUSHER_KEY : "914188472a2b75114ad5"  ,
      PUSHER_SECRET : "635a06eb0032f6453f3f",
      NEXT_PUBLIC_PUSHER_CLUSTER : "ap3" ,
      PUSHER_CLUSTER : "ap3" 
  
    },
    images: {
      domains: [],
    },
  }
  
  module.exports = nextConfig
  
  