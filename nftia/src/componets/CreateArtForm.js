import React, { useState } from 'react';
import checkUser from '../library/checkuser';
import { Navigate } from 'react-router-dom';

import * as fcl from "@onflow/fcl";
import { Configuration, OpenAIApi } from "openai";
import * as ipfsClient from 'ipfs-http-client';
import {Buffer} from 'buffer';


const CreateArtForm = (props) => {
  const [nameOfNFT, setNameOfNFT ] = useState('');
  const [nft_prompt, setNFTPrompt] = useState('');

  if (!props.user && !props.user.addr) {
    return <Navigate to="/" />;
  };

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

//FLOW ENDPOINTS SET UP.
fcl.config({
 "discovery.wallet": process.env.REACT_APP_FCL_discovery_wallet,
 "accessNode.api": process.env.REACT_APP_FCL_accessNode_api,
 "flow.network": process.env.REACT_APP_FCL_flow_network,
 "app.detail.title":process.env.REACT_APP_FCL_app_detail_title,
 "app.detail.icon": process.env.REACT_APP_FCL_app_detail_icon
});


    
   
    

    // MINT NFT - CADENCE SCRIPT -> Should be a lambda
  const mint = async () => {
    try {

      console.log("INPUT PROMT", nft_prompt);

      // Moderation
      const moderation_response = await openai.createModeration({
            input: nft_prompt,
      });

      const isFlagged = moderation_response["data"]["results"][0].flagged

      if (isFlagged) {
        return false
      }

    const image_response = await openai.createImage({
           prompt: nft_prompt,
           n: 1,
           response_format: "b64_json",
           size: "1024x1024",
         });
 
    console.log("response the openia", image_response);
      
    console.log("response the openia - only data", image_response.data.data[0].b64_json);
    const imageData = image_response.data.data[0].b64_json;

    const buffer = Buffer.from(imageData, 'base64');
      
      
    const added = await client.add(buffer);
    const hash = added.path;

      console.log("Added", added);
      console.log("HASH", hash);
      
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
        
        const Minttransaction = fcl.tx(MintTRXId).onceSealed();
        console.log(Minttransaction);
        return Minttransaction;
      } catch (error) {
        console.log("Error Making TRX - Mint NFT", error);
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
                <h1 className="text-white">Would you like to make some Art?</h1>
                <br></br>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="setNameOfNFT" onChange={(e) => setNameOfNFT(e.target.value)} />
                    <label for="setNameOfNFT">Give A Name To Your Art, Ex: "My little Tomas"</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" id="setNFTPrompt" onChange={(e) => setNFTPrompt(e.target.value)}/>
                    <label for="setNFTPrompt">Please Write your art description, Ex: "little white sad cat sitting on a table with an apple" </label>
                </div>
                <button className="btn btn-outline-info btn-lg btn-block" onClick={() => mint()}>Create Art</button>
            </div>
            <br/>
            <hr className="text-white"/>
        </div>
    );
};

export default CreateArtForm;