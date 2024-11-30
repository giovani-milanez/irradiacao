import "@/styles/globals.css";
import type { AppProps } from "next/app";
import UserProvider from "./user-provider";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return <UserProvider><Component {...pageProps} /><Toaster position="top-center" /></UserProvider>;
}
