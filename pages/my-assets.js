import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftmarketaddress, nftaddress
} from '../config'

import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchMyNFTs()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        name: meta.data.name,
        image: meta.data.image,
        pdf: meta.data.pdf
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No Book owned</h1>)
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 pt-4">
          {
            nfts.map((nft, i) => (
              <a key={i} href={nft.pdf} target="_blank" rel="noreferrer">
                <div key={i} className="border shadow m-auto rounded-xl overflow-hidden">
                <img src={nft.image} className="rounded m-auto" />
                <div className="p-4 text-xl bg-gray-400">
                <p className=" font-bold animate-bounce text-gray truncate ...">{nft.name} </p>
                <div className='border-b-2 border-gray-300 w-full mx-auto'></div>

                <p className=" text-gray-200 text-md font-bold animate-bounce py-2">Owner :</p>
                <p className=" font-bold animate-bounce text-black truncate ...">{nft.owner}</p>
                <p className=" font-bold animate-bounce text-white truncate ...">Seller : </p>    
                <p className=" font-bold animate-bounce text-black truncate ...">{nft.seller}</p>
                  <p className=" font-bold animate-bounce text-white">Price : </p>
                  <p className=" font-bold animate-bounce text-black truncate ..."> {nft.price} Matic</p>
                </div>
              </div> 
              </a>
              
            )
          )}
        </div>
      </div>
    </div>
  )
}