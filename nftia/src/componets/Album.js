import React, { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";



const Album = ({ user }) => {

    const [nfts, setNFTs] = useState([]);
    const [price, setPrice] = useState();
    const [id, setId] = useState();

    
    // Put a link of the NFT on the SALECOLLECTION - CADENCE SCRIPT -> Should be a lambda
    const listForSale = async () => {
    
    console.log("ID", id);
    console.log("PRICE", price);
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
      const ListForSaleTransaction = fcl.tx(listForSaleTRXId).onceSealed();
      console.log("DONE TRX", ListForSaleTransaction);
      return ListForSaleTransaction;
    } catch (error) {
      console.log("Error Making TRX - List NFT For Sale:", error);
    }
     }

    // Take out the link of the NFT on the SALECOLLECTION - CADENCE SCRIPT -> Should be a lambda
    const unlistFromSale = async () => {
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
      const unListFromSaleTransaction = fcl.tx(unListFromSaleTRXId).onceSealed();
      console.log("DONE TRX", unListFromSaleTransaction);
      return unListFromSaleTransaction;
    } catch (error) {
      console.log("Error Making TRX - UnList NFT From Sale:", error);
    }
    } 

    console.log("user addr",user.addr);
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
                             <h5 className="card-title">{nft.metadata.name}</h5>
                                 <p className="card-text">Card TEXT</p>
                             <div className="d-flex justify-content-between align-items-center">
                                 <div className="btn-group"> 
                                 <input type="text" onChange={(e) => setPrice(parseFloat(e.target.value).toFixed(2))} onFocus={(e) => setId(nft.id)} />
                                 <button className="btn btn-sm btn-outline-success" onClick={() => listForSale()}>List</button>
                                 <button className="btn btn-sm btn-outline-danger" onClick={() => unlistFromSale()}>UnList</button>
                                 </div>
                                 <small className="text-muted">Is Listed?</small>
                             </div>
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