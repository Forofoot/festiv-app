import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components';
import { GA_TRACKING_ID } from '../lib/gtatg';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {

    const language = "fr-fr";

    return (

      <Html lang={language}>

        <Head>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" cross0rigin="true"/>
          <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"/>
          {/* Google Analytics */}
          <script 
                async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} 
            />
            <script
                dangerouslySetInnerHTML={{
                __html: `     
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}   
                    gtag('js', new Date());
                    gtag('config', '${GA_TRACKING_ID}', {  
                    page_path: window.location.pathname,
                    });
                `,
                }}
                
            />
        </Head>

        <body>
          <Main />

          <NextScript />

        </body>
      </Html>
    );
  }
}