require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/5h1K4arfHP2SPLyh15U3u9-1dHXLfxeA',
      accounts: ['41147684248598f0905c168824c6e12696ad7960092e712d238b0167be6965a1'],
    },
  },
};


