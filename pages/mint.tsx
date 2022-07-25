import {
  useAddress,
  useMetamask,
  useWalletConnect,
  useCoinbaseWallet,
  useNFTDrop,
  useNetwork,
  useNetworkMismatch } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Image from 'next/image';
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import swal from 'sweetalert';

const Mint: NextPage = () => {
  const router = useRouter();
  // Get the currently connected wallet's address
  const address = useAddress();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();

  // Get the NFT Collection contract
  const nftDropContract = useNFTDrop(
    "0x6b8b1CD941920Bf08297a29D0A93bD05315ECD63"
  );

  async function claimNft() {
    try {
      if (networkMismatch) {
        switchNetwork && switchNetwork(250);
      }
      const tx = await nftDropContract?.claim(1);
      console.log(tx);
      swal("BERHASIL..!", "NFT berhasil di Claim...,\n sekarang kamu bisa staking NFT kamu.", "success");
      router.push(`/stake`);
    } catch (err) {
      console.log(err);
      swal("Claim NFT Gagal!", "Pastikan saldo FTM kamu terisi untuk GasFee,\n dan hanya bisa 1x claim.", "error");
    }
  }

  return (
    <div className="container text-center ">
      <h1 className={styles.h1}>Mint An NFT!</h1>

      <hr className={styles.smallDivider} />
      
<div className="alert alert-info" role="alert">
        Here is a mysteri <b>NFT Drop</b>,<br /> after you claim an NFT, you can stake the NFT to get reward a <b>DAFF token</b>.
      </div>
      {!address ? (
<div className={styles.beforeMint}>
            <Image
              className={'img-fluid'}
              src={`/01.png`}
              alt="DAFF Logo"
              width={'400'}
              height={'400'}
              style={{ borderRadius: 10 }}
            />
    <div className="card">
        <button
          className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#dompetModal"
        >
          Let's MINT
        </button>
    </div>
</div>
      ) : (
<div className={styles.beforeMint}>
            <Image
              className={'img-fluid'}
              src={`/03.jpg`}
              alt="DAFF Logo"
              width={'400'}
              height={'400'}
              style={{ borderRadius: 10 }}
            />
    <div className="card">
        <button
          className="btn btn-success"
          onClick={() => claimNft()}
        >
          Claim Free NFT
        </button>
    </div>
</div>
      )}
<div className="modal fade" id="dompetModal" tabIndex="-1">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-body">
        <div className="row p-3">
        <button className="btn justify-content-center align-items-center d-flex gap-2" data-bs-dismiss="modal" style={{background: "#ca6510", color: "#fff"}}
          onClick={connectWithMetamask}><i className={styles.metamask}></i> METAMASK WALLET</button>
        <button className="btn btn-secondary justify-content-center mt-3 align-items-center d-flex gap-2" data-bs-dismiss="modal"
          onClick={connectWithWalletConnect}><i className={styles.walletconnect}></i> WALLETconnect</button>
        <button className="btn btn-primary justify-content-center mt-3 align-items-center d-flex gap-2" data-bs-dismiss="modal"
          onClick={connectWithCoinbaseWallet}><i className={styles.coinbase}></i> CoinBase Wallet</button>
      </div>
    </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default Mint;
