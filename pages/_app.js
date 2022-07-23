import { CookiesProvider } from "react-cookie";
import Layout from '../components/Layout'
import GlobalCSS from '../styles/global.css'

function MyApp({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <GlobalCSS/>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CookiesProvider>
  )
}

export default MyApp
