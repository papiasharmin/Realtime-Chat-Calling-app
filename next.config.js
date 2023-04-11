/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env:{
      mongodb_user: 'XXXXXXX',
      mongodb_pass: 'XXXXXXX',
      mongodb_cluster: 'XXXXXXX',
      NEXTAUTH_URL:'XXXXXXXX',
      NEXTAUTH_SECRET: 'XXXXXXX',
      PUSHER_APP_ID : "XXXXXX",
      PUSHER_KEY : "XXXXXXX",
      NEXT_PUBLIC_PUSHER_KEY : "XXXXXXXXXX"  ,
      PUSHER_SECRET : "XXXXXXXXX",
      NEXT_PUBLIC_PUSHER_CLUSTER : "XXXXXXX" ,
      PUSHER_CLUSTER : "XXXXXXX" 
  
    },
    images: {
      domains: [],
    },
  }
  
  module.exports = nextConfig
  
  
