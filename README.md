## Bookverse marketplace built with Polygon, Solidity, IPFS, & Next.js

### Inspiration:
Non-fungible tokens (NFTs) and Cryptocurrencies have experienced a surge in interest on another level recently, and several celebrities, high profile people such as Jack Dorsey, Elon Musk and many more have shown a very keen interest toward them, some of the good artist and digital creators also have sold their digital artworks, music and other digital collectibles on different different NFT marketplaces as NFTs. For example a Canadian artist has sold a “virtual home” which was his own creation for nearly half a million dollars in March, 2021.

Music, digital art, AI generated art and digital collectibles are already selling on NFT marketplaces and have already become a hot and cream market in the Crypto world, selling something such as books, especially Sci-Fi books, works of fiction or any other bestselling self help book, on these NFT marketplaces has yet to be done and requires a good architecture based platform Hence born the idea for “Bookverse” - an end to end platform which can serve as marketplace for readers where authors can put their books as Non-fungible tokens (NFTs) .

### The Problem Bookverse solves
When we buy an ebook on any online platform for example on Amazon, or any other similar service our ownership over that commodity is very different from a physical book that we can keep with ourselves as long as we want. Yes, we bought an ebook on these online services, but we only and only have it for as long as Amazon or that other service is around and agrees to keep providing it as a service. If Amazon or that other service crumbled tomorrow or discontinues its services due to any reason, that book would disappear with the rest of its platform but we had purchased it Right?! We have the ownership, here comes the breach if we put it in very simple sentences we don't have any moral or physical contract with amazon to provide its services and even if amazon wants to continue providing its services and our government bans Amazon from their end then who should we address? . From this horizon, Non-fungible tokens (NFTs) have many more things in common with print books — it’s our possession, ownership, period. It won’t disappear at the whims of an outside party or government or organization. In fact, with NFTs, we don’t just own a copy of a book, we own a specific copy within a series of copies. Think first edition, second edition, and so forth of the book for which NFTs have been created. Also, the final cut after the sell from a ebook from other platform such as amazon or other similar platform that reaches Book Author is not much as compared to their efforts, Hence we need some OUT OF THE BOX solution for this problem and hence something such as Bookverse will be great idea to introduce in this space.

### Running this project

#### Local setup

To run this project locally, follow these steps.

1. Clone the project locally, change into the directory, and install the dependencies:

```sh
git clone https://github.com/goldipatel12/Bookverse-MarketPlace-On-Matic.git

cd Bookverse-MarketPlace-On-Matic

# install using NPM or Yarn
npm install

# or

yarn
```

2. Start the local Hardhat node

```sh
npx hardhat node
```

3. With the network running, deploy the contracts to the local network in a separate terminal window

```sh
npx hardhat run scripts/deploy.js --network localhost
```

4. Start the app

```
npm run dev
```

### Configuration

To deploy to Polygon test or main networks, update the configurations located in __hardhat.config.js__ to use a private key and, optionally, deploy to a private RPC like Infura.

```javascript
require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789";

// infuraId is optional if you are using Infura RPC
const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      // Infura
      // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`
      url: "https://rpc-mumbai.matic.today",
      accounts: [privateKey]
    },
    matic: {
      // Infura
      // url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [privateKey]
    }
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
```

If using Infura, update __.infuraid__ with your [Infura](https://infura.io/) project ID.
