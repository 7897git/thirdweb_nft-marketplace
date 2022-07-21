import { useAddress, useMetamask, useWalletConnect, useNFTDrop } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

const Mint: NextPage = () => {
  const router = useRouter();
  // Get the currently connected wallet's address
  const address = useAddress();

  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();

  // Get the NFT Collection contract
  const nftDropContract = useNFTDrop(
    "0xA156054bF9b3A5b3B62FD789922D234397BdAe66"
  );

  async function claimNft() {
    try {
      const tx = await nftDropContract?.claim(1);
      console.log(tx);
      alert("NFT Claimed!");
      router.push(`/stake`);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Mint An NFT!</h1>

      <p className={styles.explain}>
        Here is a mysteri <b>NFT Drop</b>,<br /> after you claim an NFT, you can stake the NFT to get reward a <b>DAFF token</b>.
      </p>
      <hr className={`${styles.smallDivider} ${styles.detailPageHr}`} />

      {!address ? (
        <button
          className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#dompetModal"
        >
          Let's MINT
        </button>
      ) : (
        <button
          className="btn btn-success"
          onClick={() => claimNft()}
        >
          Claim An NFT
        </button>
      )}
<div className="modal fade" id="dompetModal" tabindex="-1" aria-labelledby="dompetModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="dompetModalLabel">Sign in</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <div className="row p-3">
        <button className="btn btn-primary" data-bs-dismiss="modal"
          onClick={connectWithMetamask}>METAMASK WALLET</button>
        <button className="btn btn-secondary mt-3" data-bs-dismiss="modal"
          onClick={connectWithWalletConnect}>WALLETconnect</button>
      </div>
    </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default Mint;
