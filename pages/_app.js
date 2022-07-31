import { CookiesProvider } from "react-cookie";
import Layout from '../components/Layout'
import GlobalCSS from '../styles/global.css'
import {useEffect} from 'react'
import Router, { useRouter } from 'next/router'
import { GTM_ID } from '../lib/gtm'
import * as gtag from '../lib/gtag'
import { Toaster } from "react-hot-toast";

import NProgress from 'nprogress'; //nprogress module
import 'nprogress/nprogress.css'; 

Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  useEffect (() => {
    const handleRouteChange = (url) => {
      gtag.pageview (url)
    }
    router.events.on ('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off ('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
return (
    <>
      <CookiesProvider>
        <GlobalCSS/>
        <script
          dangerouslySetInnerHTML={{
            __html: `     
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}   
              gtag('js', new Date());
              gtag('config', '${GTM_ID}', {  
                page_path: window.location.pathname,
              });
            `,
          }}
        />
        <Layout>
          <Toaster
                  toastOptions={{
                      style: {
                          shadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
                      },
                  }}
              />
          <Component {...pageProps} />
        </Layout>
      </CookiesProvider>
    </>
  )
}

export default MyApp
