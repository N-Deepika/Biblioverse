require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const fs = require('fs');
require('dotenv').config();
// const privateKey = "01234567890123456789" || fs.readFileSync(".secret").toString().trim() ;
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    polygon_mumbai: {
      // Infura
      // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`
      // Alchemy
      url: "https://polygon-mumbai.g.alchemy.com/v2/ZFHrITxeGmUlyvfGlFW7hEO9h08ayiEV",
      accounts: [`0x${"d3be08ba3b83b5b77008e3b15230a00f0a85c65044d2bde268278f883418c3b1"}`],
    },
    // matic: {
    //   // Infura
    //   // url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
    //   url: "https://polygon-mainnet.g.alchemy.com/v2/VW_TGROqSpaETpS34ILV0TT7W05xg9-3",
    //   accounts: [privateKey]
    // }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

