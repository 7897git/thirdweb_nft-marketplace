import {
  ThirdwebNftMedia,
  useAddress,
  useMetamask,
  useWalletConnect,
  useNFTDrop,
  useToken,
  useTokenBalance,
  useOwnedNFTs,
  useContract,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

const nftDropContractAddress = "0xA156054bF9b3A5b3B62FD789922D234397BdAe66";
const tokenContractAddress = "0x82694260C846dd1391a9bEFC1D21a4436105D01F";
const stakingContractAddress = "0xa50Be3a577DBdd2219117BC1Fa24Cb0d58595c98";

const Stake: NextPage = () => {
  // Wallet Connection Hooks
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();

  // Contract Hooks
  const nftDropContract = useNFTDrop(nftDropContractAddress);
  const tokenContract = useToken(tokenContractAddress);

  const { contract, isLoading } = useContract(stakingContractAddress);

  // Load Unstaked NFTs
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);

  // Load Balance of Token
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);

  ///////////////////////////////////////////////////////////////////////////
  // Custom contract functions
  ///////////////////////////////////////////////////////////////////////////
  const [stakedNfts, setStakedNfts] = useState<any[]>([]);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();

  useEffect(() => {
    if (!contract) return;

    async function loadStakedNfts() {
      const stakedTokens = await contract?.call("getStakedTokens", address);

      // For each staked token, fetch it from the sdk
      const stakedNfts = await Promise.all(
        stakedTokens?.map(
          async (stakedToken: { staker: string; tokenId: BigNumber }) => {
            const nft = await nftDropContract?.get(stakedToken.tokenId);
            return nft;
          }
        )
      );

      setStakedNfts(stakedNfts);
      console.log("setStakedNfts", stakedNfts);
    }

    if (address) {
      loadStakedNfts();
    }
  }, [address, contract, nftDropContract]);

  useEffect(() => {
    if (!contract || !address) return;

    async function loadClaimableRewards() {
      const cr = await contract?.call("availableRewards", address);
      console.log("Loaded claimable rewards", cr);
      setClaimableRewards(cr);
    }

    loadClaimableRewards();
  }, [address, contract]);

  ///////////////////////////////////////////////////////////////////////////
  // Write Functions
  ///////////////////////////////////////////////////////////////////////////
  async function stakeNft(id: BigNumber) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(
      address,
      stakingContractAddress
    );
    // If not approved, request approval
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
    const stake = await contract?.call("stake", id);
  }

  async function withdraw(id: BigNumber) {
    const withdraw = await contract?.call("withdraw", id);
  }

  async function claimRewards() {
    const claim = await contract?.call("claimRewards");
  }

  if (isLoading) {
    return <div className={styles.middle_div}><div className="spinner-border text-primary" role="status">
  <span className="visually-hidden">Loading...</span>
</div></div>;
  }

  return (
    <div className="container mt-5">

      <hr className={`${styles.divider} ${styles.spacerTop}`} />

      {!address ? (
        <button
          className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#dompetModal"
        >
          Let's MINT
        </button>
      ) : (
        <>
<div className="row">
    <div className="col-12 col-sm-6 p-3 card shadow-sm">
          <h2>Your Tokens</h2>

          <div className={styles.tokenGrid}>
            <div className={styles.tokenItem}>
              <h3 className={styles.tokenLabel}>Claimable Rewards</h3>
              <p className={styles.tokenValue}>
                <b>
                  {!claimableRewards
                    ? "Loading..."
                    : ethers.utils.formatUnits(claimableRewards, 18)}
                </b>{" "}
                {tokenBalance?.symbol}
              </p>
            </div>
            <div className={styles.tokenItem}>
              <h3 className={styles.tokenLabel}>Current Balance</h3>
              <p className={styles.tokenValue}>
                <b>{tokenBalance?.displayValue}</b> {tokenBalance?.symbol}
              </p>
            </div>
          </div>
     <hr className={`${styles.spacerTop}`} />
          <button
            className="btn btn-success"
            onClick={() => claimRewards()}
          >
            Claim Rewards
          </button>
    </div>

    <div className="col-12 col-sm-6">
<ul className="nav nav-tabs" id="myTab" role="tablist">
  <li className="nav-item" role="presentation">
    <button className="nav-link active" id="stakes-tab" data-bs-toggle="tab" data-bs-target="#stakes" type="button" role="tab" aria-controls="stakes" aria-selected="true">Stakes NFT</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className="nav-link" id="unstakes-tab" data-bs-toggle="tab" data-bs-target="#unstakes" type="button" role="tab" aria-controls="unstakes" aria-selected="false">unStakes NFT</button>
  </li>
</ul>

  <div className="tab-content">
<div className="tab-pane fade show active" id="stakes" role="tabpanel" aria-labelledby="stakes-tab" tabindex="0">
       <div className={styles.stakeContainer}>
        <div className={styles.staked}>
          <h2>Your Staked NFTs</h2>
          <div className={styles.nftBoxGrid}>
            {stakedNfts?.map((nft) => (
              <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                  className={styles.nftMedia}
                />
                <h5>{nft.metadata.name}</h5>
                <button
                  className="btn btn-info btn-sm"
                  onClick={() => withdraw(nft.metadata.id)}
                >
                  Withdraw
                </button>
              </div>
            ))}
          </div>
         </div>
       </div>
     </div>
<div class="tab-pane fade" id="unstakes" role="tabpanel" aria-labelledby="unstakes-tab" tabindex="0">
        <div className={styles.unstaked}>
          <h2>Your Unstaked NFTs</h2>

          <div className={styles.nftBoxGrid}>
            {ownedNfts?.map((nft) => (
              <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                  className={styles.nftMedia}
                />
                <h3>{nft.metadata.name}</h3>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => stakeNft(nft.metadata.id)}
                >
                  Stake
                </button>
              </div>
            ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<hr className={styles.divider} />
        </>
      )}<div className="modal fade" id="dompetModal" tabindex="-1" aria-labelledby="dompetModalLabel" aria-hidden="true">
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


export default Stake;
