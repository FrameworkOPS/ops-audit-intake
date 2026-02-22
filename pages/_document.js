import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <meta name="theme-color" content="#1F3A5F" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
