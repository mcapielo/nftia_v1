import { useNavigate } from 'react-router-dom';


const Info = () => {

  const navigate = useNavigate();

   const goToLogIn = () => {
        window.scrollTo(0, 0);
        const button = document.getElementById("signInUpButton");
        button.classList.add('blinking');
    }

    const goToBlogHowItWorks = () => {
        navigate('/blog/ia-art-nft-how-it-works');
    }

    return (

    <div className="container-fluid text-white px-4 py-5 text-center">
        <h1 className="display-5 fw-bold ">A.I. Art + Blockchain = NFT</h1>
        <br/>
        <div className="clearfix">
          <img src="/images/robotpainting.jpg" className="img-fluid col-md-4 float-md-end mb-3 ms-md-3" style={{ maxWidth: '400px' }} alt="..."/>

          <p className="fs-5 mb-4 font-monospace text-break">
            Art created with artificial intelligence and minted on the blockchain combines the latest in technology with the timeless art of creation.
          </p>

          <p className="fs-5 mb-4 font-monospace text-break">
            Using a computer program to generate unique and original works of art, and adding them to the blockchain for secure verification and protection, allows for a new level of authenticity and value in the digital art world. 
          </p>

          <p className="fs-5 mb-4 font-monospace text-break">
            Whether you're an artist looking to showcase your work or a collector searching for one-of-a-kind pieces, don't miss out on this exciting new way to create and collect art.
          </p>
        </div>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <button type="button" className="btn btn-outline-info btn-lg px-4 me-sm-3 fw-bold" onClick={() => goToBlogHowItWorks()}>Read More</button>
          <button type="button" className="btn btn-outline-warning btn-lg px-4 me-md-2" onClick={() => goToLogIn()}>Join Now</button>
        </div>
      </div>

    );
};

export default Info;