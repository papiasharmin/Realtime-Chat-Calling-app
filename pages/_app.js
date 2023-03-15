import Head from 'next/head'
import { SessionProvider } from "next-auth/react";
import { Userprovider } from '../store';
import { ContextProvider } from '../socketctx';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Userprovider >
        <ContextProvider>
          <Head>
            <title>Chatapp</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
          </Head>
      
          <Component {...pageProps} />
        </ContextProvider>
      </Userprovider>
    </SessionProvider>
  )
}

export default MyApp
