import { 
    useAddress, 
    useMetamask, 
    useWalletConnect,
    useCoinbaseWallet,
    useDisconnect
} from "@thirdweb-dev/react";
import Image from 'next/image'
import Link from "next/link";
import React from "react";
import styles from "../styles/Home.module.css";
import { useState } from "react";



export default function Header() {
  // Helpful thirdweb hooks to connect and manage the wallet from metamask.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();
  const disconnectWallet = useDisconnect();

  async function Header() {


    }

  return (
    <nav className="navbar py-3 shadow fixed-top navbar-expand-lg bg-secondary">
     <div className="container-fluid">
      <div className={styles.left}>
        <div style={{ display: "contents" }}>
          <Link href="/" passHref role="button">
            <Image
              src={`/gif.webp`}
              alt="DAFF Logo"
              width={38}
              height={38}
              style={{ cursor: "pointer", borderRadius: "8px" }}
            />
          </Link>
        </div>
      </div>
      <div className={styles.right}>
        {address ? (
            <div className="dropdown">
          <button className="btn btn-danger dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{address.slice(0, 4).concat("...").concat(address.slice(-4))}
          </button>
        <ul className="dropdown-menu">
        <li><a href="javascript:;" className="dropdown-item"
            onClick={() => disconnectWallet()}><i className="fas fa-unlink"></i>  Disconnect</a></li>
    </ul>
          </div>
        ) : (
        <div className="dropdown">
          <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            Sign In Wallet
          </button>
    <ul className="dropdown-menu">
        <li><a href="javascript:;" className="dropdown-item show" style={{ display: "flex", flexWrap: "nowrap", gridGap: 10, alignItems: "center" }}
            onClick={() => connectWithMetamask()}><i className={styles.metamask}></i> Metamask</a></li>
        <li><a href="javascript:;" className="dropdown-item" style={{ display: "flex", flexWrap: "nowrap", gridGap: 10, alignItems: "center" }} onClick={connectWithWalletConnect}><i className={styles.walletconnect}></i>WalletConnect</a></li>
        <li><a href="javascript:;" className="dropdown-item" style={{ display: "flex", flexWrap: "nowrap", gridGap: 10, alignItems: "center" }} onClick={connectWithCoinbaseWallet}><i className={styles.coinbase}></i>CoinBase Wallet</a></li>
    </ul>
        </div>
        )}
      </div>
     </div>
    </nav>
  );
}
