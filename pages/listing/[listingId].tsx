import {
  MediaRenderer,
  useMarketplace,
  useNetwork,
  useNetworkMismatch,
  useListing,
  useAddress,
  useMetamask,
  useWalletConnect,
  useCoinbaseWallet,
} from "@thirdweb-dev/react";
import { ChainId, ListingType, NATIVE_TOKENS } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../../styles/Home.module.css";

const ListingPage: NextPage = () => {
  // Next JS Router hook to redirect to other pages and to grab the query from the URL (listingId)
  const router = useRouter();

  // De-construct listingId out of the router.query.
  // This means that if the user visits /listing/0 then the listingId will be 0.
  // If the user visits /listing/1 then the listingId will be 1.
  const { listingId } = router.query as { listingId: string };

  // Hooks to detect user is on the right network and switch them if they are not
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();

  // Initialize the marketplace contract
  const marketplace = useMarketplace(
    "0xD0bF80D66A78f38667711a8eC0AbE2248773908D" // Your marketplace contract address here
  );

  // Fetch the listing from the marketplace contract
  const { data: listing, isLoading: loadingListing } = useListing(
    marketplace,
    listingId
  );

  // Store the bid amount the user entered into the bidding textbox
  const [bidAmount, setBidAmount] = useState<string>("");

  if (loadingListing) {
    
    return <div className={styles.middle_div}><div className="spinner-border text-primary" role="status">
  <span className="visually-hidden">Loading...</span>
</div></div>;
  }

  if (!listing) {
    return <div className={styles.middle_div}>
<div className="toast align-items-center text-bg-primary mt-5 border-0" role="alert" aria-live="assertive" aria-atomic="true">
  <div className="d-flex">
    <div className="toast-body">Listing not found</div>
    <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
  </div></div>
</div>;
  }

  async function createBidOrOffer() {
    try {
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork('250');
        return;
      }

      // If the listing type is a direct listing, then we can create an offer.
      if (listing?.type === ListingType.Direct) {
        await marketplace?.direct.makeOffer(
          listingId, // The listingId of the listing we want to make an offer for
          1, // Quantity = 1
          NATIVE_TOKENS[ChainId.Fantom].wrapped.address, // Wrapped Ether address on Rinkeby
          bidAmount // The offer amount the user entered
        );
      }

      // If the listing type is an auction listing, then we can create a bid.
      if (listing?.type === ListingType.Auction) {
        await marketplace?.auction.makeBid(listingId, bidAmount);
      }

      alert(
        `${
          listing?.type === ListingType.Auction ? "Bid" : "Offer"
        } created successfully!`
      );
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  async function buyNft() {
    try {
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork('250');
        return;
      }

      // Simple one-liner for buying the NFT
      await marketplace?.buyoutListing(listingId, 1);
      alert("NFT bought successfully!");
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  return (
    <div className={styles.container}>
        <hr className={styles.divider} style={{ marginTop: 66 }} />
      <div className={styles.listingContainer}>
        <div className={styles.leftListing}>
          <MediaRenderer
            src={listing.asset.image}
            className={styles.mainNftImage}
          />
        </div>

        <div className={styles.rightListing}>
          <h1 className="mb-4">{listing.asset.name}</h1>
          <p className="text-muted">
            Owned by{" "}
            <b>
              {listing.sellerAddress?.slice(0, 6) +
                "..." +
                listing.sellerAddress?.slice(36, 40)}
            </b>
          </p>

          <h2>
            <b>{listing.buyoutCurrencyValuePerToken.displayValue}</b>{" "}
            {listing.buyoutCurrencyValuePerToken.symbol}
          </h2>
<div className={styles.grupInput}>
      {!address ? (
        <button
          className="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#dompetModal"
        >
          Sign In Wallet
        </button>
      ) : (
          <div className="input-group">
<input type="text" name="bidAmount" className="form-control" placeholder="Amount BID" onChange={(e) => setBidAmount(e.target.value)} aria-label="Amount Bid" />
<button className="btn btn-bid btn-outline-secondary" type="button" onClick={createBidOrOffer} style={{width: 120}}>BID</button>
  <button className="btn btn-buy btn-primary" type="button" onClick={buyNft} style={{width: 120}}>BUY</button>
        </div>
      )}
          </div>
        </div>
      </div>
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

export default ListingPage;
