import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const SaleCollections = ( { user } ) => {
  const [nftsForSale, setNFTsForSale] = useState([]);

  const navigate = useNavigate();

  const goToLogIn = () => {
    window.scrollTo(0, 0);
    const button = document.getElementById("signInUpButton");
    button.classList.add('blinking');
}

  const getUserNFTsForSale = async () => {
  
    const config = {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    }
  
    const getNFTs =  await fetch('/api/get_nfts_for_sale', config)
    .then(response => response.json())
    .then(data => {
        const output = data.flatMap(({ _id, matchingElements }) =>
        matchingElements.map((element) => ({ _id, ...element })));
        setNFTsForSale(output);
    })
    .catch((error) => {
        console.error("There was an error:", error);
    });  
  }
  
  useEffect(() => {
    getUserNFTsForSale();
    const intervalId = setInterval(getUserNFTsForSale, 20000);
    return () => clearInterval(intervalId);
}, [])

const removeNftFromMarket = async (c_address, id, s_address) => {
    
  let returning_value = false;

    const config = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        c_address: c_address,
        id, id,
        s_address: s_address
        })
      }

      const removeNftFromMarket_response =  await fetch('/api/removeNftFromMarket', config)
      .then(response => response.json())
      .then(data => {
        returning_value = data;
      })
      .catch((error) => {
          console.error("There was an error:", error);
      });  

    return returning_value;
}


const purchase = async (saleAddress,id) => {
      try{
       
        if (!user.addr) {
          return false;
        }
        const purchaseTRXId = await fcl.mutate({
          cadence: `
          import NFTIA from 0x19e6fc6fdfde98d5
          import NonFungibleToken from 0x631e88ae7f1d7c20
          import NFTIAMarketPlace from 0x19e6fc6fdfde98d5
          import FlowToken from 0x7e60df042a9c0868
  
              transaction(account: Address, id: UInt64)  {
      
                  prepare(acct: AuthAccount) {
                    let saleCollection  =   getAccount(account).getCapability(/public/NFTIASaleCollection)
                        .borrow<&NFTIAMarketPlace.SaleCollection{NFTIAMarketPlace.SaleCollectionPublic}>()
                        ?? panic("Cant Get the User Sale Collection")
  
                    let recipientCollection  =   getAccount(acct.address).getCapability(/public/NFTIACollection)
                        .borrow<&NFTIA.Collection{NonFungibleToken.CollectionPublic}>()
                        ?? panic("Cant Get the Recipient Collection")
                    
                    let price = saleCollection.getPrice(id: id)
  
                    let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price) as! @FlowToken.Vault
                    saleCollection.purchase(id: id, recipientCollection: recipientCollection , payment: <- payment)                      
                  }
      
                  execute {
                  log("A user listed an NFT Sale")
                  }
              }
          `
          ,
          args: (arg, t) =>[
            arg(saleAddress, t.Address),
            arg(parseInt(id), t.UInt64 )
          ],
          proposer: fcl.authz,
          payer: fcl.authz,
          authorization: [fcl.authz],
          limit: 9999,
        });
        
        console.log("https://testnet.flowscan.org/transaction/"+purchaseTRXId+"/events")
        const purchaseTransaction = await fcl.tx(purchaseTRXId).onceSealed();
        removeNftFromMarket(user.addr, id, saleAddress);
        return purchaseTransaction;
      } catch (error) {
        console.log("Error:", error);
      }
  
  
    }

    return (
      <div className="container mt-5">
        <h1 className="text-center mb-5">Marketplace</h1>

        {nftsForSale.length > 0 ? (
        <div className="album py-5">
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {nftsForSale.map(nft => (
                <div key={nft.id} className="col">
                    <div className="card shadow-sm">
                        <img src={`https://nftia.infura-ipfs.io/ipfs/${nft.hash}`} className="card-img-top" alt="..."></img>
                        <div className="card-body bg-dark">
                          <h4 className="card-title">{nft.name}</h4>
                          
                          <p className="card-text d-flex align-items-center ">Price {nft.price} <img src="/images/flow.png" alt="Flow Logo" className="img-fluid flow-icon ms-2 mb-0" /></p>
                          { user.addr ?
                            <button className="btn btn-outline-info mt-3" onClick={() => purchase(nft._id, nft.id)}>BUY</button>
                            : 
                            <button className="btn btn-outline-info mt-3" onClick={() => goToLogIn()}>Sign In to Buy</button>
                          }
                        </div>     
                    </div>
                </div>
            ))}
          </div>
        </div>
        ) : (
          <h3>Please Wait.</h3>
        )}

      </div>
    )
  }
  
  export default SaleCollections;
  
  