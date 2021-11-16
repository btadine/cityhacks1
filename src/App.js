import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from './utils/CityHacks.json';

//import { InputRow, TextInput, Button } from '@thumbtack/thumbprint-react';

import './App.css';

const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");
  /**
   * Create a variable here that holds the contract address after you deploy!
   */
  const contractAddress = "0xb1E9bE06B6bd4fa1Fb96e99B96b4C23881Ff1b6c";
  const contractABI = abi.abi;
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

const postHack = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const cityHacksContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await cityHacksContract.getTotalHacks({
    gasLimit: 250000
});
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await cityHacksContract.postHack({
    gasLimit: 250000
});
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await cityHacksContract.getTotalHacks({
    gasLimit: 250000
});
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        🏙️ Welcome to Cityhacks!
        </div>

        <div className="description">
          Share and discover cool things in your city (ie. cheap beers, a nice view spot, a hipster coffee place to work from...)
        </div>

        <InputRow widthRatios={[1, null]}>
    <TextInput placeholder="Enter a zip code" onChange={() => {}} />
    <Button>Find a pro</Button>
</InputRow>

<button className="postHack" onClick={postHack}>
    Post a Cityhack
</button>
        
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="postHack" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default App