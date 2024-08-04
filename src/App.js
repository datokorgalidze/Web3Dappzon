import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { contractAddress } from './utils/constants'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'
import Footer from './components/Footer'

// ABIs
import Dappazon from './abis/Dappazon.json'

// Config
// import config from './config.json'

function App() {
  const [dappzon, setDappzon] = useState(null)
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [item, setItem] = useState({});
  const [toggle, setToggle] = useState(false); 


  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);

  const loadBlockchain = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

    


      const dappzon = new ethers.Contract(
        contractAddress,
         Dappazon ,
         provider )

          setDappzon(dappzon);

          const items = [];


          for ( let i = 0; i < 9; i++){
             const item = await dappzon.items(i + 1);
             items.push(item);
          }
        
          const electronics = items.filter((item) => item.category === 'electronics');
          const clothing = items.filter((item) => item.category === 'clothing');
          const toys = items.filter((item) => item.category === 'toys');
      
          setElectronics(electronics);
          setClothing(clothing);
          setToys(toys);

  }
   
  const togglePop = (item) => {
    setItem(item);
     toggle ? setToggle(false) : setToggle(true);
  }

  useEffect(() => {
      loadBlockchain();
  },[])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>
      <h2>Welcome to Dappazon</h2>


      {electronics && clothing && toys && (
        <>
        <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop} />
        <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
        <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
        </>
      )}

      {toggle && (
         <Product item = {item} provider={provider} account={account} dappazon={dappzon} togglePop={togglePop}/>
      )}

      <Footer/>
      
    </div>
  );
}

export default App;
