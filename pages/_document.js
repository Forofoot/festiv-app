import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components';
import { GA_TRACKING_ID } from '../lib/gtag'

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
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Festiv'4 All est une association réunissant tous les passionnés de musique et de faire la promotions de multiples festivals dans le monde" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="canonical" href="https://www.festivap-em.fr/" />
          <link rel="dns-prefetch" href="https://www.festivap-em.fr/" />
          <link rel="preconnect" href="https://www.festivap-em.fr/" />
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" cross0rigin="true"/>
          <link href="https://fonts.googleapis.com/css2?family=Roboto&display=swap" rel="stylesheet"/>
          <link />
          {/* Google Analytics */}
        </Head>

        <body>

        <script
            dangerouslySetInnerHTML={{
              __html: `     
                  window.axeptioSettings = {
                    clientId: "62f65849c9b64ebf72509881",
                    cookiesVersion: "https://festivap-em/-fr",
                  };
                  
                  (function(d, s) {
                    var t = d.getElementsByTagName(s)[0], e = d.createElement(s);
                    e.async = true; e.src = "//static.axept.io/sdk.js";
                    t.parentNode.insertBefore(e, t);
                  })(document, "script");
              `,
                }}
              />
          <Main />

          <NextScript />

        </body>
      </Html>
    );
  }
}