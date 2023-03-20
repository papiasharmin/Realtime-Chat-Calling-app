import Head from 'next/head'
import { SessionProvider } from "next-auth/react";
import { Userprovider } from '../store';
import { Pusherprovider } from '../pushercontext';
function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Userprovider >
        <Pusherprovider>
          <Head>
            <title>Chatapp</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
          </Head>
      
          <Component {...pageProps} />
        </Pusherprovider>
      </Userprovider>
    </SessionProvider>
  )
}

export default MyApp
