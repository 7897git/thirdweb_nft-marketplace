import type { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import {
  MediaRenderer,
  useActiveListings,
  useMarketplace,
} from "@thirdweb-dev/react";

const Home: NextPage = () => {
  const router = useRouter();

  // Connect your marketplace smart contract here (replace this address)
  const marketplace = useMarketplace(
    "0xbB4Cbd8891C4623dB797D510EEAd921730A84a0E" // Your marketplace contract address here
  );
  
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(marketplace);

  return (
    <div className="container-fluid">
<div className={styles.paralax}></div>
        <hr className={styles.divider} style={{ marginTop: 66 }} />
        <h1 className={styles.h1}><span className="text-primary">unknown</span><span className="text-muted fst-italic fw-bold fs-7" style={{ opacity: "75%", fontSize: 70, marginLeft: "-2%" }}>©️</span> <span className="text-white">nft Marketplace</span></h1>

        <hr className={styles.divider} />
        <div className={styles.main}>
          {
            // If the listings are loading, show a loading message
            loadingListings ? (
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            ) : (
              // Otherwise, show the listings
              <div className={styles.listingGrid}>
                {listings?.map((listing) => (
                  <div
                    key={listing.id}
                    className="card shadow"
                    onClick={() => router.push(`/listing/${listing.id}`)}
                    style={{ overflow: "hidden"}}
                  >
                    <MediaRenderer
                      src={listing.asset.image}
                      style={{
                        // Fit the image to the container
                        width: "100%",
                        height: "100%",

                      }}
                    />
                    <h2 className={styles.nameContainer}>
                      <Link className="stretched-link" href={`/listing/${listing.id}`}>
                        <a className="stretched-link">{listing.asset.name}</a>
                      </Link>
                    </h2>

                    <p>

                      <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </p>
                  </div>
                ))}
              </div>
            )
          }
        </div>
        <hr className={styles.divider} /><div className={styles.background_putih}>
      <h2 className={styles.h1} style={{padding: 20}}>Get random mistery NFT drop & Get reward <b>UC</b> token from stakes</h2>
      <div
        className={styles.nftRowGrid}
        role="button"
        onClick={() => router.push(`/mint`)}
      >
        {/* Mint a new NFT */}
        <div className={styles.optionSelectBox}>
          <img src={`/icons/drop.webp`} alt="drop" />
          <h2 className={styles.selectBoxTitle}>Mint NFT</h2>
          <p className={styles.selectBoxDescription}>
            Get NFT Drop from the collection to claim an <b>UC</b> token.<br />
            1 wallet 1 claim.
          </p>
        </div>

        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push(`/stake`)}
        >
          <img src={`/icons/token.webp`} alt="drop" />
          <h2 className={styles.selectBoxTitle}>Stake Your NFTs</h2>
          <p className={styles.selectBoxDescription}>
            If you have claim <b>a NFT drop</b>{" "}
            stake your NFTs, and earn tokens from <b>UC</b> token.<br/>Claim Reward Here.
          </p>
        </div>
      </div>

        <hr className={styles.divider} style={{borderColor: "#000"}} />

        <p className={styles.explain}>
          NFT marketplace using{" "}
          <b>
            {" "}
            <a
              href="https://polygon.technology/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.purple}
            >
              POLYGON
            </a>
          </b>{" "}
          network.<br /> list your ERC721 and ERC1155 tokens for auction or direct sale.
        </p>

        </div>
        <div style={{ marginRight: 20, marginBottom: 20, position: "fixed", bottom: 0, right: 0 }}>
          <Link href="/create">
            <a className={styles.mainButton} style={{ textDecoration: "none" }}>
              Create A Listing
            </a>
          </Link>
        </div>
      </div>
  );
};

export default Home;
