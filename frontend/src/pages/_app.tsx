import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import UserProvider from "../utils/use-auth";


export default function App({ Component, pageProps }: AppProps) {
  return <UserProvider><Component {...pageProps} /><Toaster position="top-center" /></UserProvider>;
}
