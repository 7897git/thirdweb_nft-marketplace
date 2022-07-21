import {
  useAddress,
  useMetamask,
  useWalletConnect, 
  useMarketplace,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import { NATIVE_TOKEN_ADDRESS, TransactionResult } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

const Create: NextPage = () => {
  // Next JS Router hook to redirect to other pages
  const router = useRouter();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const address = useAddress();

  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();

  // Connect to our marketplace contract via the useMarketplace hook
  const marketplace = useMarketplace(
    "0xbB4Cbd8891C4623dB797D510EEAd921730A84a0E" // Your marketplace contract address here
  );

  // This function gets called when the form is submitted.
  async function handleCreateListing(e: any) {
    try {
      // Ensure user is on the correct network
      if (networkMismatch) {
        switchNetwork && switchNetwork(4);
        return;
      }

      // Prevent page from refreshing
      e.preventDefault();

      // Store the result of either the direct listing creation or the auction listing creation
      let transactionResult: undefined | TransactionResult = undefined;

      // De-construct data from form submission
      const { listingType, contractAddress, tokenId, price } =
        e.target.elements;

      // Depending on the type of listing selected, call the appropriate function
      // For Direct Listings:
      if (listingType.value === "directListing") {
        transactionResult = await createDirectListing(
          contractAddress.value,
          tokenId.value,
          price.value
        );
      }

      // For Auction Listings:
      if (listingType.value === "auctionListing") {
        transactionResult = await createAuctionListing(
          contractAddress.value,
          tokenId.value,
          price.value
        );
      }

      // If the transaction succeeds, take the user back to the homepage to view their listing!
      if (transactionResult) {
        router.push(`/`);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function createAuctionListing(
    contractAddress: string,
    tokenId: string,
    price: string
  ) {
    try {
      const transaction = await marketplace?.auction.createListing({
        assetContractAddress: contractAddress, // Contract Address of the NFT
        buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        reservePricePerToken: 0, // Minimum price, users cannot bid below this amount
        startTimestamp: new Date(), // When the listing will start
        tokenId: tokenId, // Token ID of the NFT.
      });

      return transaction;
    } catch (error) {
      console.error(error);
    }
  }

  async function createDirectListing(
    contractAddress: string,
    tokenId: string,
    price: string
  ) {
    try {
      const transaction = await marketplace?.direct.createListing({
        assetContractAddress: contractAddress, // Contract Address of the NFT
        buyoutPricePerToken: price, // Maximum price, the auction will end immediately if a user pays this price.
        currencyContractAddress: NATIVE_TOKEN_ADDRESS, // NATIVE_TOKEN_ADDRESS is the crpyto curency that is native to the network. i.e. Rinkeby ETH.
        listingDurationInSeconds: 60 * 60 * 24 * 7, // When the auction will be closed and no longer accept bids (1 Week)
        quantity: 1, // How many of the NFTs are being listed (useful for ERC 1155 tokens)
        startTimestamp: new Date(0), // When the listing will start
        tokenId: tokenId, // Token ID of the NFT.
      });

      return transaction;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={(e) => handleCreateListing(e)}>
      <div className="container-fluid">
        {/* Form Section */}
        <div className={styles.collectionContainer}>
          <h1 className={styles.ourCollection}>
            Upload your NFT to our marketplace
          </h1>

          <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input
              type="radio"
              name="listingType"
              id="directListing"
              value="directListing"
              defaultChecked
              className="btn-check"
            />
            <label htmlFor="directListing" className="btn btn-outline-primary">
              Direct Listing
            </label>
            <input
              type="radio"
              name="listingType"
              id="auctionListing"
              value="auctionListing"
              className="btn-check"
            />
            <label htmlFor="auctionListing" className="btn btn-outline-primary">
              Auction Listing
            </label>
          </div>
        <hr className={styles.divider}/>
          {/* NFT Contract Address Field */}
<div className="row">
    <div className="col-12">
        <div class="form-floating mb-3" style={{textAlign: "start"}}>
          <input
            type="text"
            name="contractAddress"
            className="form-control" id="Contract"
            placeholder="NFT Contract Address"
          />
            <label for="Contract">NFT Contract Address</label>
        </div>
       </div>
    </div>
<div className="row">
    <div className="col-12 col-sm-6">
          {/* NFT Token ID Field */}
        <div class="form-floating mb-3" style={{textAlign: "start"}}>
          <input
            type="text"
            name="tokenId"
            className="form-control" id="Token"
            placeholder="NFT Token ID"
          />
            <label for="Token">NFT Token ID</label>
        </div>
</div>
    <div class="col-12 col-sm-6">
          {/* Sale Price For Listing Field */}
        <div class="form-floating mb-3" style={{textAlign: "start"}}>
          <input
            type="text"
            name="price"
            className="form-control" id="Price"
            placeholder="Sale Price"
          />
            <label for="Price">Sale Price</label>
        </div>
  </div>
</div>
{!address ? (
        <button
          className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#dompetModal">
          Sign in Wallet
        </button>
      ) : (
          <button
            type="submit"
            className="btn btn-warning"
          >
            List your NFT
          </button>
      )}
        </div>
      </div>
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
    </form>
  );
};

export default Create;
