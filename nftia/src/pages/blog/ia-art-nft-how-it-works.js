import React from 'react';
import { useNavigate } from 'react-router-dom';


const Blog_ia_art_nft_how_it_works = () => {

  const navigate = useNavigate();

  const goToLogIn = () => {
       window.scrollTo(0, 0);
       const button = document.getElementById("signInUpButton");
       button.classList.add('blinking');
   }



  return (
    <div className='container-fluid'>

<h1 className="mb-5">Non-Fungible Tokens (NFTs) with Art Created by Artificial Intelligence</h1>


      <div className="col-md-4 offset-md-4">
					<img src="/images/featured_2.jpg" alt="Image OPENIA" className="img-fluid"/>
			</div>
      <br/>
        
        <div className="col-lg-6 offset-md-3">
        <p className="mb-4  font-monospace text-break text-center">Non-fungible tokens (NFTs) featuring art created using artificial intelligence are a type of digital asset that can be bought and sold like traditional artworks. Here's what you need to know:</p>
        <h2 className="mb-2">What are NFTs?</h2>
        <p className="mb-4  font-monospace text-break">NFTs are digital assets that are stored on a blockchain and can't be replicated or replaced. They are unique and can be bought and sold like traditional artworks, with the value of the NFT determined by supply and demand on the market.</p>
        <h2 className="mb-2">How are NFTs created?</h2>
        <p className="mb-4  font-monospace text-break">To create an NFT, an artist must first create a digital artwork. This can be done using a variety of tools and techniques, including traditional digital art software and AI-powered tools. Once the artwork is complete, the artist can use a platform like <a href="/" className="text-decoration-none">NFTIA</a> to mint the NFT and make it available for sale.</p>
        <h2 className="mb-2">Why are NFTs with art created by AI unique and valuable?</h2>
        <p className="mb-4  font-monospace text-break">Art created using artificial intelligence is often unique and not easily replicated, making NFTs featuring this type of art particularly valuable. These assets can be bought and sold like traditional artworks, and their value is determined by supply and demand on the market.</p>
        <h2 className="mb-2">Conclusion</h2>
        <p className="mb-4  font-monospace text-break">NFTs featuring art created using artificial intelligence are a unique and valuable type of digital asset. If you're interested in buying or selling these assets, you can visit our <a href="/" className="text-decoration-none">MarketPlace</a>. Just be sure to do your research and consider the risks and rewards before making any investment decisions.</p>

        </div>				
        <div className="col-lg-6 offset-md-3">
          <div className="ml-auto">
            <a href="/marketplace" className="btn btn-outline-warning me-5" >Visit The MarketPlace</a>
            <a href="#" className="btn btn-outline-info" onClick={() => goToLogIn()}>Start Creating AI Art</a>
          </div>
        </div>
    </div>
  );
};

export default Blog_ia_art_nft_how_it_works;