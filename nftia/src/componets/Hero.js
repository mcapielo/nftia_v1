import { useNavigate } from 'react-router-dom';



const Hero = () => {

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

    <div className="hero py-5">
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-6">
                    <h1 className="display-4 mb-4">Join the Future of Art and Creativity</h1>
                    <p className="lead mb-4">Explore our unique collection of IA-created art. Our skilled team has harnessed AI to bring you one-of-a-kind works, made with cutting-edge tech and innovative techniques. Own a piece of the future with our NFTs, each a truly unique creation. Join us in celebrating the limitless potential of IA-created art.</p>
                    
                    <button type="button" className="btn btn-outline-info btn-lg px-4 me-md-2" onClick={() => goToLogIn()}>Join Now</button>
                    <button type="button" className="btn btn-outline-warning btn-lg px-4 me-md-2" onClick={() => goToBlogHowItWorks()}>Learn More</button>

                </div>
                <div className="col-lg-6 d-flex justify-content-center align-items-center mt-5">
                    <img src="https://nftia.infura-ipfs.io/ipfs/QmUXgcu2qTBD76Y58EwGom97d2rQjD55stj6DLpWZ2PsLi" alt="Hero Image" className="img-fluid" style={{ maxWidth: '400px' }} />
                </div>
            </div>
        </div>
    </div>

  );
};

export default Hero;









