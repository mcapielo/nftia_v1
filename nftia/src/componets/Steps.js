
const Steps = () => {

    return (

        <div className="container">
            <hr></hr>
            <br/>
            <h1 className="my-5">Ready to become a digital artist?</h1>
            <br/><br/><br/>
            <div className="container marketing">
                <div className="row">
                <div className="col-lg-4">
                    <img src="images/powerby/openia.jpg" alt="OpenAI" className="imgPowerBy rounded-circle shadow-4-strong"/>
                    <h2 className="fw-normal">1. SingUp</h2>
                    <p>This is the part when you send your request to join us.</p>
                    <p>
                        <button type="button" className="btn btn-outline-info btn-lg px-4 me-md-2 fw-bold" data-bs-toggle="modal" data-bs-target="#modalSignup">Join</button>
                    </p>
                </div>
                <div className="col-lg-4">
                <img src="images/powerby/flow.png" alt="Flow" className="imgPowerBy rounded-circle shadow-4-strong"/>

                <h2 className="fw-normal">2. Found your Wallet</h2>
                <p>You should have flows on your account to pay the cost of the work creation.</p>
                <p>
                <button type="button" className="btn btn-outline-info btn-lg px-4 me-md-2 fw-bold" data-bs-toggle="modal" data-bs-target="#modalSignup">DapperLabs</button>
                </p>
                </div>
                <div className="col-lg-4">
                <img src="images/powerby/dalle.jpeg" alt="Flow" className="imgPowerBy rounded-circle shadow-4-strong"/>
                <h2 className="fw-normal">3. Make Art</h2>
                <p>With a simple description of what you want and a click you will make art</p>
                <p>
                    <button type="button" className="btn btn-outline-info btn-lg px-4 me-md-2 fw-bold" data-bs-toggle="modal" data-bs-target="#modalSignup">Join</button>
                </p>
                </div>
            </div>
            </div>
        </div>
    
    );
};

export default Steps;