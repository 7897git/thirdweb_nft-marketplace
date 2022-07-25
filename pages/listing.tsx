import type { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import {
  MediaRenderer,
  useActiveListings,
  useMarketplace,
} from "@thirdweb-dev/react";

  const Listing: NextPage = () => {
  const router = useRouter();

  const marketplace = useMarketplace("0xD0bF80D66A78f38667711a8eC0AbE2248773908D");
  
  const { data: listings, isLoading: loadingListings } =
    useActiveListings(marketplace);

  return (
    <div className="container text-center">
<div className={styles.paralax}></div>
        <hr className={styles.divider} style={{ marginTop: 66 }} />
        <h1 className={styles.h1}><span className="text-primary">DAFF </span><span className="text-danger fs-5" style={{ marginLeft: -25 }}>nft</span> Marketplace</h1>

        <hr className={styles.divider} />
        <div className={styles.main}>
          {
            // If the listings are loading, show a loading message
            loadingListings ? (
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            ) : (
              // Otherwise, show the listings
              <div className={styles.listingGrid}>
                {listings?.map((listing) => (
                  <div
                    key={listing.id}
                    className="card shadow text-center"
                    onClick={() => router.push(`/listing/${listing.id}`)}
                    style={{ overflow: "hidden"}}
                  >
                    <MediaRenderer
                      src={listing.asset.image}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "200px",
                        objectPosition: "center"
                      }}
                    />
                <div className="card-body p-0">
                    <h2 className={styles.nameContainer}>
                      <Link className="text-decoration-none" href={`/listing/${listing.id}`}>
                        <a className="stretched-link fs-6">{listing.asset.name}</a>
                      </Link>
                    </h2>

                    <p className="text-muted">

                      <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
                      {listing.buyoutCurrencyValuePerToken.symbol}
                    </p></div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
    </div>
  );
};

export default Listing;
