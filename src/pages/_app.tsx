import { type AppType } from "next/app";

import { trpc } from "../lib/trpc";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return <Component {...pageProps} />;
};

export default trpc.withTRPC(MyApp);
