import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body suppressHydrationWarning={true} className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
