import { useState , useEffect } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import { uploadFileToIPFS, uploadJSONToIPFS } from "./../pinata"

const key = "2d05c8afe947432b8a8e";
const secret = "0dcccefcc4b3514964c20dd434878f82e544477be313aa7ad47d3b83e326055a";

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

// const ipfsClient = require('ipfs-http-client');

// const projectId = '1qmt...XXX';   // <---------- your Infura Project ID

// const projectSecret = 'c920...XXX';  // <---------- your Infura Secret
// // (for security concerns, consider saving these values in .env files)

// const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

// const client = ipfsClient.create({
//     host: 'ipfs.infura.io',
//     port: 5001,
//     protocol: 'https',
//     headers: {
//         authorization: auth,
//     },
// });

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/Market.sol/NFTMarket.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [selectedFile, setSelectedFile] = useState()
  const [pdfUrl,setPdfUrl] = useState(null)
  const [preview, setPreview] = useState()
  const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })
  const router = useRouter()

  // async function onChange(e) {
  //   const file = e.target.files[0]
  //   try {
  //     const added = await client.add(
  //       file,
  //       {
  //         progress: (prog) => console.log(`received: ${prog}`)
  //       }
  //     )
  //     const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS/${added.path}`
  //     setFileUrl(url)
  //   } catch (error) {
  //     console.log('Error uploading file: ', error)
  //   }  
  // }

   //This function uploads the NFT image to IPFS
   async function onChange(e) {
    console.log("CHANGED FILE")
    var file = e.target.files[0];
    setSelectedFile(file);
    //check for file extension
    try {
        //upload the file to IPFS
        const response = await uploadFileToIPFS(file);
        console.log(response)
        if(response.success === true) {
        console.log("SUCCESS ISS TRUEE LOB")
            console.log("Uploaded image to Pinata: ", response.pinataURL)
            setFileUrl(response.pinataURL);
        }
    }
    catch(e) {
        console.log("Error during file upload", e);
    }
}

useEffect(() => {
  if (!selectedFile) {
      setPreview(undefined)
      return
  }

  

  const objectUrl = URL.createObjectURL(selectedFile)
  setPreview(objectUrl)

  // free memory when ever this component is unmounted
  return () => URL.revokeObjectURL(objectUrl)
}, [selectedFile])

async function onChangeFile(e) {
  var file = e.target.files[0];
 
  //check for file extension
  try {
      //upload the file to IPFS
      const response = await uploadFileToIPFS(file);
      console.log(response)
      if(response.success === true) {
      console.log("SUCCESS")
          console.log("Uploaded pdf to Pinata: ", response.pinataURL)
          setPdfUrl(response.pinataURL);
      }
  }
  catch(e) {
      console.log("Error during file upload", e);
  }
} 

  async function createMarket() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl || !pdfUrl) {
      
      return ;
  }
    /* first, upload to IPFS */
    const nftJSON = {
      name, description, price, image: fileUrl, pdf: pdfUrl
  }
    // try {
    //   const added = await client.add(data)
    //   const url = `https://ipfs.infura.io/ipfs/${added.path}`
    //   /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
    //   createSale(url)
    // } catch (error) {
    //   console.log('Error uploading file: ', error)
    // }  
    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      if(response.success === true){
          console.log("Uploaded JSON to Pinata: ", response)
          await createSale(response.pinataURL);
          router.push("/")
      }
  }
  catch(e) {
      console.log("error uploading JSON metadata:", e)
  }
  }

  

  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
    
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')
  
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, { value: listingPrice })
    await transaction.wait()
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          placeholder="Book Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Book Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        <input
          placeholder="Book Price in Matic"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />
        <label for="files" className="p-4">Select Cover Image</label>
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onChange}
        />
        
        {
          fileUrl && (
            <img className="rounded mt-4" height="auto" width="350" src={fileUrl} />
          )
        }
        <label for="files" className="p-4">Select Book PDF</label>
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={ onChangeFile }
        />
        <button onClick={createMarket} className="font-bold mt-4 bg-blue-500 text-white rounded p-4 shadow-lg">
        MINT A BOOK NFT
        </button>
      </div>
    </div>
  )
}