import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import 'bootstrap/dist/css/bootstrap.css';
import "../styles/globals.css";
import swal from 'sweetalert';
import Head from "next/head";
import Header from "../components/Header";
import { useEffect } from "react";

// This is the chainId your dApp will work on.
  const activeChainId = ChainId.Fantom;

function MyApp({ Component, pageProps }: AppProps) {

useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
}, []);

  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Head>
        <title>DAFF nft Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Listing Your NFTs For Sale, Accept Bids, and Buy NFTs"
        />
        <meta
          name="keywords"
          content="DAFF Marketplace, NFT Marketplace, NFT Auction"
        />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
      </Head>
      <Header />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
