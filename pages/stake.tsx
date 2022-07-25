import {
  ThirdwebNftMedia,
  useAddress,
  useMetamask,
  useWalletConnect,
  useCoinbaseWallet,
  useNFTDrop,
  useToken,
  useTokenBalance,
  useOwnedNFTs,
  useContract,
  useNetwork,
  useNetworkMismatch
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import Image from 'next/image'
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import swal from 'sweetalert';

const nftDropContractAddress = "0x6b8b1CD941920Bf08297a29D0A93bD05315ECD63";
const tokenContractAddress = "0xb8f9088eEf25e32d1f984ed8aD55dCD968d420F2";
const stakingContractAddress = "0x30540675be866BDA8DF11197acB03bF1784DE11A";

const Stake: NextPage = () => {
  // Wallet Connection Hooks
  const address = useAddress();
  const networkMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();
  const connectWithMetamask = useMetamask();
  const connectWithWalletConnect = useWalletConnect();
  const connectWithCoinbaseWallet = useCoinbaseWallet();

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
      if (networkMismatch) {
        switchNetwork && switchNetwork(250);
        return; 
        }
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
    try {
    const claim = await contract?.call("claimRewards");
      console.log(claim);
      swal("Berhasil", "Token DAFF siap mendarat di dompet kamu.", "success");
    } catch (error) {
      console.log(error);
      swal("GAGAL!", "Minimal Withdraw 10 DAFF token.", "error");
    }
  }

  if (isLoading) {
    return <div className={styles.middle_div}><div className="spinner-border text-primary" role="status">
  <span className="visually-hidden">Loading...</span>
</div></div>;
  }

  return (

    <div className='container text-center mt-5'>
     <hr className={styles.spacerTop} />
      {!address ? (
<div className={styles.beforeIn}>
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
          className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#dompetModal"
        >
          Let's STAKING
        </button>
    </div>
</div>
      ) : (
        <>
<div className="row">
    <div className="col-12 col-sm-6 p-3">
<div className="card shadow-sm">
        <div className="card-header">
          <h2>Your Tokens</h2>
        </div>
  <div className="card-body">
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
          <button
            className="btn btn-success float-end"
            onClick={() => claimRewards()}
          >
            Claim Rewards
          </button>
        </div>
      </div>
    </div>

    <div className="col-12 col-sm-6 p-3">
<div className="card">
<ul className="nav nav-tabs" id="myTab" role="tablist">
  <li className="nav-item" role="presentation">
    <button className="nav-link active" id="stakes-tab" data-bs-toggle="tab" data-bs-target="#stakes" type="button" role="tab" aria-controls="stakes" aria-selected="true">Stakes NFT</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className="nav-link" id="unstakes-tab" data-bs-toggle="tab" data-bs-target="#unstakes" type="button" role="tab" aria-controls="unstakes" aria-selected="false">unStakes NFT</button>
  </li>
</ul>

  <div className="tab-content">
<div className="tab-pane fade show active" id="stakes" role="tabpanel" aria-labelledby="stakes-tab" tabIndex="0">
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
<div className="tab-pane fade" id="unstakes" role="tabpanel" aria-labelledby="unstakes-tab" tabIndex="0">
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
</div>
<hr className={styles.divider} />
        </>
      )}<div className="modal fade" id="dompetModal" tabIndex="-1" >
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


export default Stake;
