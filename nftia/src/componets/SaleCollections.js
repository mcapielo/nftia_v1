import React, { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";



const SaleCollections = () => {
  
    const [nfts, setNFTs] = useState([]);
  
    
    useEffect(() => {
        getUserNFTsForSale();
    }, [])
  
   
    const marketplace_items = async(users_marketplace) => {
  
        const results = [];
  
        for (const user_marketplace of users_marketplace) {
    
            console.log("USER",user_marketplace.address);
    
        
          const getSaleCollectionNFTs =  await fcl.query({
            cadence: `
            import NFTIA from 0x19e6fc6fdfde98d5
            import NonFungibleToken from 0x631e88ae7f1d7c20
            import NFTIAMarketPlace from 0x19e6fc6fdfde98d5
            
            pub fun main(account: Address) : {UFix64: NFTIAMarketPlace.SaleItem } {
                
                let saleCollection  =   getAccount(account).getCapability(/public/NFTIASaleCollection)
                                    .borrow<&NFTIAMarketPlace.SaleCollection{NFTIAMarketPlace.SaleCollectionPublic}>()
                                    ?? panic("Cant Get the User Sale Collection")
            
                let collection  =   getAccount(account).getCapability(/public/NFTIACollection)
                                    .borrow<&NFTIA.Collection{NonFungibleToken.CollectionPublic, NFTIA.CollectionPublic}>()
                                    ?? panic("Cant Get the User Collection")
            
                let saleIDs = saleCollection.getIDs()
                let returnVals: {UFix64: NFTIAMarketPlace.SaleItem } = {}
    
                if saleIDs.length != 0 {
                  for saleID in saleIDs {
                    let price = saleCollection.getPrice(id: saleID)
                    let nftRef = collection.borrowEntireNFT(id: saleID)
                    log(price)
                    log(nftRef)
        
                  } 
                } 
                return returnVals
            }
            `,
            args: (arg, t) =>[arg( user_marketplace.address , t.Address)],
          });
    
          const result = await getSaleCollectionNFTs.decode();
          results.push(result);
        }
  
        return (results);
  
    }
   
    // FUNCTION TO GET USERS FROM MONGO
    const getUserNFTsForSale = async () => {
  
        const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        }
  
        const getUsers =  await fetch('/api/get_users', config)
        .then(response => response.json())
        .then(data => {
             if (Array.isArray(data)) {
                setNFTs(marketplace_items(data));
            } else {
                // Handle non-array response
                console.error('Response is not an array');
            }
        })
        .catch((error) => {
            // This function will be called if the Promise is rejected with an error
            console.error("There was an error:", error);
        });  
    }
  
    // const purchase = async (id) => {
    //   try{
    //     const purchaseTRXId = await fcl.mutate({
    //       cadence: `
    //       import NFTIA from 0x19e6fc6fdfde98d5
    //       import NonFungibleToken from 0x631e88ae7f1d7c20
    //       import NFTIAMarketPlace from 0x19e6fc6fdfde98d5
    //       import FlowToken from 0x7e60df042a9c0868
  
    //           transaction(account: Address, id: UInt64)  {
      
    //               prepare(acct: AuthAccount) {
    //                 let saleCollection  =   getAccount(account).getCapability(/public/NFTIASaleCollection)
    //                     .borrow<&NFTIAMarketPlace.SaleCollection{NFTIAMarketPlace.SaleCollectionPublic}>()
    //                     ?? panic("Cant Get the User Sale Collection")
  
    //                 let recipientCollection  =   getAccount(acct.address).getCapability(/public/NFTIACollection)
    //                     .borrow<&NFTIA.Collection{NonFungibleToken.CollectionPublic}>()
    //                     ?? panic("Cant Get the Recipient Collection")
                    
    //                 let price = saleCollection.getPrice(id: id)
  
    //                 let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price) as! @FlowToken.Vault
    //                 saleCollection.purchase(id: id, recipientCollection: recipientCollection , payment: <- payment)                      
    //               }
      
    //               execute {
    //               log("A user listed an NFT Sale")
    //               }
    //           }
    //       `
    //       ,
    //       args: (arg, t) =>[
    //         arg(props.address, t.Address),
    //         arg(parseInt(id), t.UInt64 )
    //       ],
    //       proposer: fcl.authz,
    //       payer: fcl.authz,
    //       authorization: [fcl.authz],
    //       limit: 9999,
    //     });
        
    //     console.log("https://testnet.flowscan.org/transaction/"+purchaseTRXId+"/events")
    //     const purchaseTransaction = fcl.tx(purchaseTRXId).onceSealed();
    //     console.log("DONE TRX", purchaseTransaction);
    //     return purchaseTransaction;
    //   } catch (error) {
    //     console.log("Error Making TRX - Purchase NFT :", error);
    //   }
  
  
    // }

    const purchase = async (id) => {
        console.log(id);
    }
  
  
    return (
      <div style={{backgroundColor: 'lightgreen'}}>
        <h1>SALE COLLECTION</h1>
           {Object.keys(nfts).map(nftID => (
              <div key={nftID}>
                   <h1>ID: {nftID}</h1>
                 
                   
                   <button onClick={() => purchase(nftID)}>Purchase This NFT</button>
               </div>
           ))}
      </div>
    );
  }
  
  export default SaleCollections;
  
  