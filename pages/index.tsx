import type { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import Image from 'next/image';
import {
  ChainId,
  useContractMetadata,
  useNetwork,
  useNetworkMismatch,
  useActiveClaimCondition,
  useEditionDrop,
  useNFT,
  ThirdwebNftMedia,
  useAddress,
  useMetamask
} from "@thirdweb-dev/react";
import { BigNumber } from "ethers";
import { useState } from "react";
  const Home: NextPage = () => {
  const router = useRouter();
const myEditionDropContractAddress =
  "0x15bA5756CD3A35B4d656CB481cF93adfCA05c448";
const editionDrop = useEditionDrop(myEditionDropContractAddress);
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const isOnWrongNetwork = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  // The amount the user claims, updates when they type a value into the input field.
  const [quantity, setQuantity] = useState<number>(1); // default to 1
  const [claiming, setClaiming] = useState<boolean>(false);

  // Load contract metadata
  const { data: contractMetadata } = useContractMetadata(
    myEditionDropContractAddress
  );

  const { data: nftMetadata } = useNFT(editionDrop, 0);

  // Load the active claim condition
  const { data: activeClaimCondition } = useActiveClaimCondition(
    editionDrop,
    BigNumber.from(0)
  );

  console.log({
    contractMetadata,
    activeClaimCondition,
  });

  // Loading state while we fetch the metadata
  if (!editionDrop || !contractMetadata) {
    return<div className={styles.middle_div}> <div class="spinner-grow text-dark" role="status">
              <span class="visually-hidden">Loading...</span></div>
            </div>;
  }

  // Function to mint/claim an NFT
  async function mint() {
    // Make sure the user has their wallet connected.
    if (!address) {
      connectWithMetamask();
      return;
    }

    // Make sure the user is on the correct network (same network as your NFT Drop is).
    if (isOnWrongNetwork) {
      switchNetwork && switchNetwork(ChainId.Mumbai);
      return;
    }

    setClaiming(true);

    try {
      const minted = await editionDrop?.claim(0, quantity);
      console.log(minted);
      alert(`Successfully minted NFT${quantity > 1 ? "s" : ""}!`);
    } catch (error: any) {
      console.error(error);
      alert((error?.message as string) || "Something went wrong");
    } finally {
      setClaiming(false);
    }
  }
  return (
    <div className="container text-center">
<div className={styles.paralax}></div>
        <hr className={styles.divider} style={{ marginTop: 50 }} />

        <hr className={styles.divider} /><div className={styles.background_hitam}>
      
      <div className="row">
        <div className="col-md-6 text-center">
          {/* Image Preview of NFTs */}
        <div className="card shadow" style={{maxWidth: "100%", height: "auto", margin: "28px 0", overflow: "hidden"}}>
          <ThirdwebNftMedia
            // @ts-ignore
            metadata={nftMetadata?.metadata}
            className="img-fluid rounded shadow"
            width={600}
            height={600}
            style={{objectFit: "cover", objectPosition: "center"}}
          />
<div className={styles.card_body}>
          {/* Amount claimed so far */}
          <div className={styles.total}>
            <div className={styles.mintAreaLeft}>
              <p style={{margin: 0, color: "#2196F3"}}>Total Minted </p>
            </div>
            <div className={styles.mintAreaRight}>
              {activeClaimCondition ? (
                <p style={{margin: 0, color: "#2196F3"}}>
                  {/* Claimed supply so far */}
                  <b> {activeClaimCondition.currentMintSupply}</b>
                  {" / "}
                  {activeClaimCondition.maxQuantity}
                </p>
              ) : (
                <div className={styles.middle_div}>
            <div class="spinner-grow text-dark" role="status">
              <span class="visually-hidden">Loading...</span>
            </div></div>
              )}
            </div>
          </div>

          {/* Show claim button or connect wallet button */}
          {address ? (
            <>

              <div className={styles.btn_group_counter}>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setQuantity(quantity - 1)}
                  disabled={quantity <= 1}
                  style={{borderRadius: "25px", padding: "3px 8px"}}
                >
                 <i className="fa fa-minus"></i>
                </button>

                <h6>{quantity}</h6>

                <button
                  style={{borderRadius: "25px", padding: "3px 8px"}}
                  className="btn btn-sm btn-primary"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={
                    quantity >=
                    parseInt(
                      activeClaimCondition?.quantityLimitPerTransaction || "0"
                    )
                  }
                >
                 <i className="fa fa-plus"></i>
                </button>
              </div>
              <button
                className="btn btn-primary" style={{width: 100}}
                onClick={mint}
                disabled={claiming}
              >
                {claiming ? "Minting..." : "Mint"}
              </button>
            </>
          ) : (
            <button className="btn btn-primary" style={{width: 100}} onClick={connectWithMetamask}>
              Mint Me
            </button>
          )}
        </div>
    </div>
</div>
        <div className="col-md-6 text-center">
      <div
        className={styles.nftRowGrid}
      >
        {/* Game NFT */}
        <div
          className={styles.optionSelectBox}
          role="button"
          data-bs-toggle="modal"
          data-bs-target="#comingsoon"
        >
          <Image src={`/icons/game.webp`}
              width={40}
              height={40}  alt="game" />
          <h2 className={styles.selectBoxTitle}>Game NFTs</h2>
          <p className={styles.selectBoxDescription}>
            NFTs Game, <b>Play to earn</b>{" "}
            
          </p>
        </div>
        {/* Colection of my NFT */}
        <div className={styles.optionSelectBox}
        role="button"
        onClick={() => router.push(`/listing`)}>
          <Image src={`/icons/drop.webp`}
              width={40}
              height={40}  alt="drop" />
          <h2 className={styles.selectBoxTitle}>NFT collection</h2>
          <p className={styles.selectBoxDescription}>
            Explore our collection.
          </p>
        </div>
        {/* Mint a new NFT */}
        <div className={styles.optionSelectBox}
        role="button"
        onClick={() => router.push(`/mint`)}>
          <Image src={`/icons/edition-drop.webp`}
              width={40}
              height={40}  alt="drop" />
          <h2 className={styles.selectBoxTitle}>NFT drop</h2>
          <p className={styles.selectBoxDescription}>
            Get NFT Drop to claim <b>DAFF</b> token.
          </p>
        </div>
        {/* Stake NFT */}
        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/stake`)}
        >
          <Image src={`/icons/token.webp`}
              width={40}
              height={40} alt="token" />
          <h2 className={styles.selectBoxTitle}>Stake Your NFTs</h2>
          <p className={styles.selectBoxDescription}>
            <b>stake your NFTs,</b>{" "}
             and earn tokens from <b>DAFF</b> token.
          </p>
        </div>
      </div>
<div class="alert alert-secondary" role="alert">
<span className="fs-6 text-muted">Please use<b>
            {" "}
            <a
              href="https://fantom.foundation/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.blue}
            >
              FANTOM
            </a> </b> network for transaction, if not, you will lose your money.</span>
</div>
        </div>
        </div>
      </div>

        <p className={styles.explain}>
          NFT marketplace using{" "}
          <b>
            {" "}
            <a
              href="https://fantom.foundation/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.blue}
            >
              FANTOM
            </a>
          </b>{" "}
          network.<br /> 
        </p>
<div className="modal fade" id="comingsoon" tabIndex="-1">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content">
      <div className="modal-body">
        <h1>Comming Soon</h1>
      </div>
    </div>
    </div>
  </div>
      </div>
  );
};

export default Home;
