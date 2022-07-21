import { CookiesProvider } from "react-cookie";
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <CookiesProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CookiesProvider>
  )
}

export default MyApp
