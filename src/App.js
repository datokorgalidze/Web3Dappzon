import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { sepoliaContractAddress } from "./utils/constants";

import config from "./config.json";

// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";
import Footer from "./components/Footer";

// ABIs
import Dappazon from "./abis/Dappazon.json";

function App() {
  const [dappzon, setDappzon] = useState(null);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false);

  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);

  const loadBlockchain = async () => {
    if (!window.ethereum)
      return alert(
        "MetaMask is not installed. Please install it to use this app."
      );
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();

    console.log("Network Chain ID:", network.chainId);

    let dappzonAddress;
    if (config[network.chainId]?.dappazon) {
      dappzonAddress = config[network.chainId].dappazon.address;
    } else {
      dappzonAddress = sepoliaContractAddress;
    }

    if (!dappzonAddress) {
      console.error("No contract address found for the current network.");
      return;
    }

    const dappzon = new ethers.Contract(dappzonAddress, Dappazon, provider);
    console.log("contract addres:", dappzonAddress);
    setDappzon(dappzon);

    const items = [];

    for (let i = 0; i < 9; i++) {
      const item = await dappzon.items(i + 1);
      items.push(item);
    }

    const electronics = items.filter((item) => item.category === "electronics");
    const clothing = items.filter((item) => item.category === "clothing");
    const toys = items.filter((item) => item.category === "toys");

    setElectronics(electronics);
    setClothing(clothing);
    setToys(toys);
  };

  const togglePop = (item) => {
    setItem(item);
    toggle ? setToggle(false) : setToggle(true);
  };

  useEffect(() => {
    loadBlockchain();
  }, []);

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Welcome to Dappazon</h2>
      {!account ? (
        <h3>
          Please connect your Metamsak wallet and select Test Sepolia Network.
        </h3>
      ) : (
        ""
      )}

      {electronics && clothing && toys && (
        <>
          <Section
            title={"Clothing & Jewelry"}
            items={clothing}
            togglePop={togglePop}
          />
          <Section
            title={"Electronics & Gadgets"}
            items={electronics}
            togglePop={togglePop}
          />
          <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </>
      )}

      {toggle && (
        <Product
          item={item}
          provider={provider}
          account={account}
          dappazon={dappzon}
          togglePop={togglePop}
        />
      )}

      <Footer />
    </div>
  );
}

export default App;
