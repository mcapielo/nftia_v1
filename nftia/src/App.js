import React, { useState, useEffect } from 'react';
import { Route, Routes } from "react-router-dom";
import * as fcl from "@onflow/fcl";

import './App.css';

import Home from "./pages/Home";
import MarketPlace from "./pages/MarketPlace";
import Workshop from "./pages/Workshop";
import NotFound from "./pages/NotFound";
import Header from "./componets/Header";
import Footer from "./componets/Footer";
import Blog_ia_art_nft_how_it_works from "./pages/blog/ia-art-nft-how-it-works"



const App = () => {
  const [user, setUser] = useState()
  

  
  useEffect(() => fcl.currentUser.subscribe(setUser), [])

//FLOW ENDPOINTS SET UP.
fcl.config({
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Endpoint set to Testnet
  "accessNode.api": "https://rest-testnet.onflow.org", // Endpoint set to Testnet
  "flow.network": "testnet",
  "app.detail.title": "NFTIA",
  "app.detail.icon": "http://localhost:3000/images/logo-nftia.png"
})


  return (
    <div className="App container-fluid">
      <Header user={user}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<MarketPlace user={user} />} />
        <Route path="/workshop" element={<Workshop user={user} />} />
        <Route path="/blog/ia-art-nft-how-it-works" element={<Blog_ia_art_nft_how_it_works />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
};
export default App;
