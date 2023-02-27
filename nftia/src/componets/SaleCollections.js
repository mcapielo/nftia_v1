import React, { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const SaleCollections = ( { user } ) => {
  const [nftsForSale, setNFTsForSale] = useState([]);

  console.log("USER", user);


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
          console.log("ntfsforsale",data);
          const output = data.flatMap(({ _id, matchingElements }) =>
          matchingElements.map((element) => ({ _id, ...element })));
          console.log("NEW NFTS",output);
          setNFTsForSale(output);
    })
    .catch((error) => {
        console.error("There was an error:", error);
    });  
  }
  
    
  useEffect(() => {
    getUserNFTsForSale();
    const intervalId = setInterval(getUserNFTsForSale, 30000);
    return () => clearInterval(intervalId);
}, [])


const purchase = async (saleAddress,id) => {
      try{

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
        console.log("DONE TRX", purchaseTransaction);
        return purchaseTransaction;
      } catch (error) {
        console.log("Error Making TRX - Purchase NFT :", error);
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

                            <button className="btn btn-outline-info mt-3" onClick={() => purchase(nft._id, nft.id)}>BUY</button>
                          </div>     
                      </div>
                  </div>
             ))}
            </div>
          </div>
          ) : (
           <h3>No products to sell yet  = ( .</h3>
          )}

        </div>
    )
  }
  
  export default SaleCollections;
  
  