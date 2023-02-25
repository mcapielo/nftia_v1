import React, { useState, useEffect } from 'react';


const SaleCollections = () => {
  const [nftsForSale, setNFTsForSale] = useState([]);

    
  useEffect(() => {
    getUserNFTsForSale();
}, [])


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


  
    return (
        <div className="container mt-5">
          <h1 className="text-center mb-5">Marketplace</h1>

          {nftsForSale.length > 0 ? (
          <div className="album py-5">
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
             {nftsForSale.map(nft => (
                  <div key={nft.hash} className="col">
                     <div className="card shadow-sm">
                          <img src={`https://nftia.infura-ipfs.io/ipfs/${nft.hash}`} className="card-img-top" alt="..."></img>
                          <div className="card-body bg-dark">
                            <h4 className="card-title">{nft.name}</h4>
                            <p className="card-text">Algo?</p>
                            <p className="card-text">{nft.price}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="rating text-info">
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                              </div>
                              <small className="text-muted">{nft.reviews} reviews</small>
                            </div>
                            <button className="btn btn-primary mt-3">Add to cart</button>
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
  
  