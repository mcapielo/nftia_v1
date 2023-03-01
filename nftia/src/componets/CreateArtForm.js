import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';

import * as fcl from "@onflow/fcl";
import { Configuration, OpenAIApi } from "openai";
import * as ipfsClient from 'ipfs-http-client';
import {Buffer} from 'buffer';


const CreateArtForm = ({user}) => {

  
  const [nameOfNFT, setNameOfNFT ] = useState('');
  const [nft_prompt, setNFTPrompt] = useState('');
  const [loading_mint_button, setLoadingMintButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);



  //OPEN IA SET UP.
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OpenAIApiKey,
  });
  const openai = new OpenAIApi(configuration);

  //INFURA SET UP.
  const projectId = process.env.REACT_APP_INFURA_projectId;   
  const projectSecret = process.env.REACT_APP_INFURA_projectSecret;
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
  // https://nft.api.infura.io/
  const client = ipfsClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    method: 'POST',
    headers: {
        authorization: auth,
    },
  });
   
  const AddNftToCollection = async (id, name, prompt, trxid, hash) => {
    
    let returning_value = false;

      const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            address: user.addr,
            id, id,
            name: name,
            prompt: prompt,
            trxid: trxid,
            hash: hash
          })
        }
  
        const add_user_nft =  await fetch('/api/add_user_nft', config)
        .then(response => response.json())
        .then(data => {
          console.log("flag user response api", data);
          //returning_value =  {"ok": data.ok, "AccountSetUp": data.value?.AccountSetUp? data.value.AccountSetUp : false};
        })
        .catch((error) => {
            // This function will be called if the Promise is rejected with an error
            console.error("There was an error:", error);
        });  

      return returning_value;
  }

  const getUser = async () => {

    let response_return = false;
    
    const config = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        c_a: user.addr
        })
      }

      const _userApi =  await fetch('/api/get_user', config)
      .then(response => response.json())
      .then(data => {
        console.log("User response api", data);
        return response_return = data;
      })
      .catch((error) => {
          // This function will be called if the Promise is rejected with an error
          console.error("There was an error:", error);
      });  
      return response_return

  }

  // MINT NFT - CADENCE SCRIPT -> Should be a lambda
  const mint = async () => {
    try {
      
      const _user = await getUser()

      if(!_user) {
        setErrorMessage('Hold On, something went Wrong, try again.');
        return false;
      }
      
      if (_user.NFTCounter === 1) {
        setErrorMessage('You Reach - 1 Art Created - Limit for Now, Stay Tunned');
        return false;
      }
     
      if (nameOfNFT === '' || nft_prompt === '') {
        setErrorMessage('You Art needs a Name and Description.');
        return false;
      } else {
        if (window.confirm(`Are you sure you want to Mint an NFT with Name: ${nameOfNFT} and Description: ${nft_prompt}?`)) {
          
          //HANDLE MINT OF THE NFT
          setLoadingMintButton(true);
          console.log("INPUT PROMT", nft_prompt);

          // Moderation
          const moderation_response = await openai.createModeration({
                input: nft_prompt,
          });

          const isFlagged = moderation_response["data"]["results"][0].flagged

          if (isFlagged) {
            setErrorMessage('Please Rewrite Your Art Description - Violence, Adult or Hate Content Is NOT Allow');
            setLoadingMintButton(false);
            return false
          }

          const image_response = await openai.createImage({
            prompt: nft_prompt,
            n: 1,
            response_format: "b64_json",
            size: "1024x1024",
          });

          //console.log("response the openia", image_response);
  
          //console.log("response the openia - only data", image_response.data.data[0].b64_json);
          const imageData = image_response.data.data[0].b64_json;
          const buffer = Buffer.from(imageData, 'base64');
          const added = await client.add(buffer);
          const hash = added.path;

  
          try {
            const MintTRXId = await fcl.mutate({
                cadence: `
                import NFTIA from 0x19e6fc6fdfde98d5

                transaction (ipfsHash: String, name: String) {
                
                  prepare(acct: AuthAccount) {
                    
                    let collection = acct.borrow<&NFTIA.Collection>(from: /storage/NFTIACollection)
                                      ?? panic ("This collection does not exist here")
                    let nft <- NFTIA.createToken(ipfsHash: ipfsHash, metadata: {"name": name})
                    collection.deposit(token: <- nft)
                  }
                  
                  execute {
                    log("A user minted an NFT into their account")
                  }
                }
                `,
                args: (arg, t) =>[arg(hash, t.String),fcl.arg(nameOfNFT, t.String)],
                proposer: fcl.authz,
                payer: fcl.authz,
                authorization: [fcl.authz],
                limit: 9999,
            });
            console.log("https://testnet.flowscan.org/transaction/"+MintTRXId+"/events")
            
            const Minttransaction = await fcl.tx(MintTRXId).onceSealed();
            if (Minttransaction.statusString === "SEALED") {
              const id = Minttransaction.events[0].data.id;
              AddNftToCollection(id, nameOfNFT, nft_prompt, MintTRXId, hash);
              document.getElementById("setNameOfNFT").value = "";
              document.getElementById("setNFTPrompt").value = "";
              setNameOfNFT('');
              setNFTPrompt('');
              setLoadingMintButton(false);
              setErrorMessage('Your Beautiful Art Is On The Way, Please Hold On.');
            }
            return Minttransaction;
          } catch (error) {
            console.log("Error Making TRX - Mint NFT", error);
          }
        }
      }
    } catch (error) {
      console.log("Error Creating file - IPFS", error);
    }
  }

  return (
      <div className='container'>
          <br/>
          <hr className="text-white" />
          <div className="container text-center">
              <h1 className="text-white">Would you like to make Art?</h1>
              <br></br>
              {errorMessage &&   
                <div className='alert alert-info fade show' role="alert">
                    {errorMessage}
                </div>
              }
              <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="setNameOfNFT" onChange={(e) => setNameOfNFT(e.target.value)}  onFocus={(e) => setErrorMessage(null)}/>
                  <label className="text-dark" for="setNameOfNFT">Give A Name To Your Art, Ex: "My happy Emma"</label>
              </div>
              <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="setNFTPrompt" onChange={(e) => setNFTPrompt(e.target.value)} onFocus={(e) => setErrorMessage(null)}/>
                  <label className="text-dark" for="setNFTPrompt">Write your Art Description, Ex: "happy golden dog on a field with cherry blossom trees" </label>
              </div>


              {loading_mint_button ? 
                <button className="btn btn-outline-info btn-lg btn-block" type="button" disabled>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Art...
                </button> 
              :
                <button className="btn btn-outline-info btn-lg btn-block" onClick={() => mint()}>Create Art</button>
              }
            </div>
          <br/>
          <hr className="text-white"/>
      </div>
  );
};

export default CreateArtForm;