import React, { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import PostTemplate from './PostTemplate';


const Album = ({ user }) => {

    const [nfts, setNFTs] = useState([]);
    const [price, setPrice] = useState(0);
    const [errorListMessage, setErrorListMessage] = useState(null);
    const [showListSpinner, setShowListSpinner] = useState(null);


    const setNFTSaleStatus =  async (hash, price, forSale) => {
    
      let returning_value = false;

      const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            address: user.addr,
            hash: hash,
            nftPrice: price,
            setOnSaleStatus: forSale
          })
        }
  
        const setNFTSaleStatus =  await fetch('/api/setNFTSaleStatus', config)
        .then(response => response.json())
        .then(data => {
          console.log("setNFTSaleStatus response api", data);
          //returning_value =  {"ok": data.ok, "AccountSetUp": data.value?.AccountSetUp? data.value.AccountSetUp : false};
        })
        .catch((error) => {
            // This function will be called if the Promise is rejected with an error
            console.error("There was an error:", error);
        });  

      return returning_value;


    }

    // Put a link of the NFT on the SALECOLLECTION - CADENCE SCRIPT -> Should be a lambda
    const listForSale = async (id, hash) => {

      if (!(typeof price === 'number' && !isNaN(price) && price > 0)) {
        setErrorListMessage('Please put a price for your NFT');
        return false;
      } else {
          if (window.confirm('Are you sure you want to put on Sale a NFT?')) {
            setShowListSpinner(true);
            try{
              const listForSaleTRXId = await fcl.mutate({
                cadence: `
                  import NFTIAMarketPlace from 0x19e6fc6fdfde98d5
              
                      transaction(id: UInt64, price: UFix64)  {
              
                          prepare(acct: AuthAccount) {
                            let saleCollection = acct.borrow<&NFTIAMarketPlace.SaleCollection>(from: /storage/NFTIASaleCollection)
                                                  ?? panic("This SaleCollection does not exist")
                            saleCollection.listForSale(id: id, price: price)                      
                          }
              
                          execute {
                          log("A user listed an NFT Sale")
                          }
                      }
                  `
                ,
                args: (arg, t) =>[arg(parseInt(id), t.UInt64 ),arg(price, t.UFix64)],
                proposer: fcl.authz,
                payer: fcl.authz,
                authorization: [fcl.authz],
                limit: 9999,
              });
              
              console.log("https://testnet.flowscan.org/transaction/"+listForSaleTRXId+"/events")
              const ListForSaleTransaction = await fcl.tx(listForSaleTRXId).onceSealed();
              console.log("DONE TRX", ListForSaleTransaction);
              if (ListForSaleTransaction) {
                setNFTSaleStatus(hash, price, true);
                setShowListSpinner(false);
              }
              return ListForSaleTransaction;
            } catch (error) {
              console.log("Error Making TRX - List NFT For Sale:", error);
            }
          
          }
      } 
    }

    // Take out the link of the NFT on the SALECOLLECTION - CADENCE SCRIPT -> Should be a lambda
    const unlistFromSale = async (id, hash) => {
      try{
        const unListFromSaleTRXId = await fcl.mutate({
          cadence: `
            import NFTIAMarketPlace from 0x19e6fc6fdfde98d5
        
                transaction(id: UInt64)  {
        
                    prepare(acct: AuthAccount) {
                      let saleCollection = acct.borrow<&NFTIAMarketPlace.SaleCollection>(from: /storage/NFTIASaleCollection)
                                            ?? panic("This SaleCollection does not exist")
                      saleCollection.unlistFromSale(id: id)                     
                    }
        
                    execute {
                    log("A user listed an NFT Sale")
                    }
                }
            `
          ,
          args: (arg, t) =>[arg(parseInt(id), t.UInt64 )],
          proposer: fcl.authz,
          payer: fcl.authz,
          authorization: [fcl.authz],
          limit: 9999,
        });
        
        console.log("https://testnet.flowscan.org/transaction/"+unListFromSaleTRXId+"/events")
        const unListFromSaleTransaction = await fcl.tx(unListFromSaleTRXId).onceSealed();
        console.log("DONE TRX", unListFromSaleTransaction);
        if (unListFromSaleTransaction) {
          setNFTSaleStatus(hash, 0, false);
        }
        return unListFromSaleTransaction;
      } catch (error) {
        console.log("Error Making TRX - UnList NFT From Sale:", error);
      }
    } 

    //console.log("user addr",user.addr);
    //console.log("address", props.address);

    const getUserNFTs = async () => {
        const result = await fcl.query({
            cadence: `
                import NFTIA from 0x19e6fc6fdfde98d5
                import NonFungibleToken from 0x631e88ae7f1d7c20
                
                pub fun main(account: Address): [&NFTIA.NFT] {
                let collection  =   getAccount(account).getCapability(/public/NFTIACollection)
                                    .borrow<&NFTIA.Collection{NonFungibleToken.CollectionPublic, NFTIA.CollectionPublic}>()
                                    ?? panic("Cant Get the User Collection")
            
                let returnVals: [&NFTIA.NFT] = []
                let ids = collection.getIDs()
                for id in ids {
                    returnVals.append(collection.borrowEntireNFT(id: id))
                }
                return returnVals
                }
            `,
            args: (arg, t) =>[arg(user.addr, t.Address)],
        });

        console.log("resutls", result);
        setNFTs(result);
    }

    useEffect(() => {
        getUserNFTs();
        const intervalId = setInterval(getUserNFTs, 30000);
      return () => clearInterval(intervalId);
    }, [])

  return (
    <div className="container text-white ">
        <br></br>
        <h1>Your Art</h1>
        <br></br>
        {nfts.length > 0 ? (
          <div className="album py-5">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
             {nfts.map(nft => (
                 <div key={nft.id} className="col">
                     <div className="card shadow-sm">
                          <img src={`https://nftia.infura-ipfs.io/ipfs/${nft.ipfsHash}`} className="card-img-top" alt="..."></img>
                          <div className="card-body bg-dark">
                            <h4 className="card-title">{nft.metadata.name}</h4>
                            <p className="card-text">Card TEXT</p>

                            <div className="row">
                              <div className="col-md-12 mb-3 mx-auto">
                                <label htmlFor="inputField" className="form-label">Price</label>
                                <input type="text" className="form-control form-control-sm" onChange={(e) => setPrice(parseFloat(e.target.value).toFixed(2))} placeholder="Set a price number. Ex: 9.34"/>
                              </div>
                            </div>


                            <div className="row">
                              <div className="col-md-6">
                                <button className="btn btn-outline-secondary btn-sm w-100" type="button" onClick={() => listForSale(nft.id, nft.ipfsHash)}>List For Sale</button>
                              </div>
                              <div className="col-md-6">
                                <button className="btn btn-outline-secondary btn-sm w-100" type="button" onClick={() => unlistFromSale(nft.id, nft.ipfsHash)}>UnList For Sale</button>
                              </div>
                            </div>


                          </div>


                          <div className="card-footer bg-dark">
                            <small className="text-muted">Share on Social</small>
                            <PostTemplate imageUrl={ `https://nftia.infura-ipfs.io/ipfs/${nft.ipfsHash}`} />
                        </div>
                     </div>
                 </div>
             ))}
            </div>
         </div>
        ) : (
        <h3>Nothing Yet...Lets Create Some Cool Stuff!</h3>
      )}


       
    </div>
  );
}

export default Album;