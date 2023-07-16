// require('dotenv').config();

const key = "2d05c8afe947432b8a8e";
const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2OGQ0N2U3My00MDU4LTQ3YjgtYjQyNC0wZjgxYTA2ZTAwNDQiLCJlbWFpbCI6ImRlZXBpa2EyODIwMDJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjJkMDVjOGFmZTk0NzQzMmI4YThlIiwic2NvcGVkS2V5U2VjcmV0IjoiMGRjY2NlZmNjNGIzNTE0OTY0YzIwZGQ0MzQ4NzhmODJlNTQ0NDc3YmUzMTNhYTdhZDQ3ZDNiODNlMzI2MDU1YSIsImlhdCI6MTY4MjQxNTQ3OX0.j9ud9J1lJzZUcGgLRizPQElm2tGWiVO5KOQAcByD3_k`
const axios = require('axios');
const FormData = require('form-data');

export const uploadJSONToIPFS = async(JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const data = JSON.stringify({
        "pinataMetadata": {
            "name": JSONBody.name,
          },
        "pinataContent": JSONBody
    });
    //making axios POST request to Pinata ⬇️
    // const formData = new FormData();
    //             formData.append("file", fileImg);

    return axios 
        .post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': JWT
            }
        })
        .then(response => ({
            success: true,
            pinataURL: `http://cf-ipfs.com/ipfs/${response.data.IpfsHash}`,
          }))
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};

export const uploadFileToIPFS = async(file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //making axios POST request to Pinata ⬇️
    
    let data = new FormData();
    data.append('file', file);
    console.log(data)
    // const metadata = JSON.stringify({
    //     name: 'testname',
    //     keyvalues: {
    //         exampleKey: 'exampleValue'
    //     }
    // });
    // data.append('pinataMetadata', metadata);

    // //pinataOptions are optional
    // const pinataOptions = JSON.stringify({
    //     cidVersion: 0,
    //     customPinPolicy: {
    //         regions: [
    //             {
    //                 id: 'FRA1',
    //                 desiredReplicationCount: 1
    //             },
    //             {
    //                 id: 'NYC1',
    //                 desiredReplicationCount: 2
    //             }
    //         ]
    //     }
    // });
    // data.append('pinataOptions', pinataOptions);

   return axios 
        .post(url, data, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                
                Authorization: JWT
            }
        })
        .then(function (response) {
            console.log("image uploaded", response.data.IpfsHash)
            return {
               success: true,
               pinataURL: "http://cf-ipfs.com/ipfs/" + response.data.IpfsHash
           };
        })
        .catch(function (error) {
            console.log(error)
            return {
                success: false,
                message: error.message,
            }

    });
};
