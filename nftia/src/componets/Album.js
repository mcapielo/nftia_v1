import React, { useState, useEffect } from 'react';
import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";
import PostTemplate from './PostTemplate';
import './Album.css';


const Album = ({ user }) => {

    const [price, setPrice] = useState(0);
    const [showListSpinner, setShowListSpinner] = useState(null);
    const [showUnListSpinner, setShowUnListSpinner] = useState(null);
    const [nfts_flow, setFlowData] = useState([]);
    const [nfts_db, setDBData] = useState([]);
    const [nfts, setNFTS] = useState([]);

    const setNFTSaleStatus =  async (id, price, forSale) => {
    
      let returning_value = false;

      const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            address: user.addr,
            id: id,
            nftPrice: price,
            setOnSaleStatus: forSale
          })
        }
  
        const setNFTSaleStatus =  await fetch('/api/setNFTSaleStatus', config)
        .then(response => response.json())
        .then(data => {
        })
        .catch((error) => {
            console.error("There was an error:", error);
        });  

      return returning_value;


    }

    const listForSale = async (id) => {

      if (!(typeof price === 'string' && !isNaN(parseFloat(price)) && parseFloat(price) > 0)) {
        window.confirm('Price should be a number greater than 0.');
        return false;
      } else {
          if (window.confirm('Are you sure you want to LIST a NFT?')) {
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
              if (ListForSaleTransaction) {
                setNFTSaleStatus(id, price, true);
                setShowListSpinner(false);
              }
              return ListForSaleTransaction;
            } catch (error) {
              console.log("Error:", error);
            }
          
          }
      } 
    }

    const unlistFromSale = async (id) => {
      
      try{
        if (window.confirm('Are you sure you want to UNLIST a NFT?')) {
          setShowUnListSpinner(true);

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
          if (unListFromSaleTransaction) {
            setNFTSaleStatus(id, 0, false);
            setShowUnListSpinner(false);
          }
          return unListFromSaleTransaction;
        }   
      } catch (error) {
        console.log("Error:", error);
      }
    }

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

        if(result) {
          return(result);
        }
    }

    const fetchUserData = async () => {
      const [FlowResponse, DBResponse] = await Promise.all([
        getUserNFTs(),
        getUserNFTsFromDb(),
      ]);
      
      if (FlowResponse) {
        setFlowData(FlowResponse);
      }

      if (DBResponse) {
        setDBData(DBResponse);
      }
      
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
          return response_return = data;
        })
        .catch((error) => {
            console.error("There was an error:", error);
        });  
        return response_return
  
    }

    const getUserNFTsFromDb = async () => {
      const _user = await getUser()
      if (_user.NFTCounter === 1) {
        return _user.NFTCollection;
      }
    }

    useEffect(() => {
        fetchUserData();
        const intervalId = setInterval(fetchUserData, 60000);
        return () => clearInterval(intervalId);
    }, [])


    useEffect(() => {
      if (nfts_flow && nfts_db) {
        const updatedNFTS = nfts_flow.map((nft_flow) => {
          const matchingProductB = nfts_db.find(
            (nft_db) => nft_db.id === nft_flow.id
          );
          if (matchingProductB) {
            return { ...nft_flow, price: matchingProductB.price , forSale: matchingProductB.forSale};
          }
          return nft_flow;
        });

        setNFTS(updatedNFTS)
      }
  }, [nfts_flow, nfts_db]);

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
                            
                            <h6>Price</h6>                           
                            <div className="input-group mb-3">
                              <input id="inputPrice" type="number" className="form-control" aria-label="Price for NFT" defaultValue={nft.price? nft.price : 0} onChange={(e) => setPrice( parseFloat(e.target.value).toFixed(6) ) }  onFocus={(e) => e.target.placeholder = ""} onBlur={(e) => e.target.placeholder = "0"} placeholder="0"/>
                              <span className="input-group-text bg-secondary">
                              <img src="/images/flow.png" className="img-fluid flow-icon" alt="Flow Logo"></img>
                              <span className='ms-2 text-white fw-bold'>Flow</span>
                              </span> 
                            </div>


                            
                            <div className="row">
                              { nft.forSale ?
                                <p>LISTED FOR SALE</p>
                                :
                                <p>NOT LISTED FOR SALE</p>
                              }
                              
                              <div className="col-md-6">
                                {showListSpinner ? 
                                  <button className="btn btn-outline-secondary btn-sm w-100" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Listing for Sale...
                                  </button> 
                                :
                                  <button className="btn btn-outline-secondary btn-sm w-100" type="button" onClick={() => listForSale(nft.id)}>List For Sale</button>
                                 } 
                              </div>
                              <div className="col-md-6">
                              {showUnListSpinner ? 
                                  <button className="btn btn-outline-secondary btn-sm w-100" type="button" disabled>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    UnListing for Sale...
                                  </button> 
                                :
                                  <button className="btn btn-outline-secondary btn-sm w-100" type="button" onClick={() => unlistFromSale(nft.id)}>UnList For Sale</button>
                                 } 
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