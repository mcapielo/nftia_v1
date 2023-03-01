import { useNavigate } from 'react-router-dom';



const Steps = () => {

    const navigate = useNavigate();


    const goToLogIn = () => {
        window.scrollTo(0, 0);
        const button = document.getElementById("signInUpButton");
        button.classList.add('blinking');
    }

    const goToBlogHowItWorks = () => {
        navigate('/ia-art-nft-how-it-works');
    }

    return (

        <div className="container">
            <hr></hr>
            <br/>
            <h1 className="my-5">Ready to become a digital artist?</h1>
            <br/><br/><br/>
            <div className="container marketing">
                <div className="row">
                <div className="col-lg-4">
                    <h2 className="fw-normal text-info ">1. SingUp</h2>
                    <p>First You Need To Enter the App.</p>
                    <p>
                        <button type="button" className="btn btn-outline-info btn-lg px-4 me-md-2 fw-bold" onClick={() => goToLogIn()}>Join Now</button>
                    </p>
                </div>
                <div className="col-lg-4">
                    <h2 className="fw-normal text-info">2. Name and Description</h2>
                    <p>Simple Form Where You Set a Name and Give the Description of you Art</p>
                </div>
                <div className="col-lg-4">
                    <h2 className="fw-normal text-info">3. Get your IA NFT Art</h2>
                    <p>And thats it, you got you IA Art saved on the Flow Blockchain</p>
                </div>
            </div>
            </div>
        </div>
    
    );
};

export default Steps;