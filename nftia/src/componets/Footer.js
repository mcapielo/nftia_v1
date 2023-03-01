import { useState } from 'react';
import UserMessage from './UserMessage'
import './Footer.css';


const Footer = () => {

  const [emailSub, setEmailSub] = useState();
  const [showAlert, setShowAlert] = useState(false);

  const subscribe = async ( ) => {
    try{
      const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           email: emailSub
           })
      }
      const response =  await fetch('/api/add_subscriber', config)
      .then((res) => res.json())
      .then(data => {
        document.getElementById("newsletter1").value = "";
        setShowAlert(true);
      })
      .catch((err) => console.error(err))
      
    } catch (error) {
      console.log("THIS IS AN ERROR", error);
    }
  
  }


  return (
    <div className="container py-4 my-4 border-top">
        <footer className="py-5">
          <div className="row">
            <div className="col-4 col-md-2 mb-3">
              <h5>PRODUCT</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted link-info">Features</a></li>
                <li className="nav-item mb-2"><a href="/blog/ia-art-nft-how-it-works" className="nav-link p-0 text-muted link-info">How it Works</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted link-info">Pricing</a></li>
                <li className="nav-item mb-2"><a href="/marketplace" className="nav-link p-0 text-muted link-info">MarketPlace</a></li>
              </ul>
            </div>

            <div className="col-4 col-md-2 mb-3">
              <h5>HELP</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted link-info">Community</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted link-info">Blog</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted link-info">FAQs</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted link-info">Docs</a></li>
              </ul>
            </div>

            <div className="col-4 col-md-2 mb-3">
              <h5>COMPANY</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted link-info">About Us</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted link-info">Contact Us</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted link-info">Terms of Service</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted link-info">Privacy Policy</a></li>
              </ul>
            </div>

            <div className="col-md-5 offset-md-1 mb-3">
              <form>
                <h5>Join Our Community: Subscribe Today </h5>
                <p>Receive the latest news and updates about our products.</p>
                <div className="d-flex flex-column flex-sm-row w-100 gap-2">
                  <label for="newsletter1" className="visually-hidden">Email address</label>
                  <input id="newsletter1" type="text" className="form-control" onChange={(e) => setEmailSub(e.target.value)} placeholder="Email address"/>
                  <button className="btn btn-outline-info" type="button" onClick={() => subscribe(emailSub)}>Subscribe</button>
                </div>
              </form>
              <br></br>
              <p className='text-muted'>You could also contact by email to: <a className='text-info text-decoration-none'>nftia0x01@gmail.com</a>.</p>
                  <UserMessage variant="info" message="Thank you, Now you are subscribed!" triggerAlert={showAlert} />
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center py-4 my-4 border-top">
            <p className="text-center mb-3 mb-sm-0">&copy; 2023 NFTIA, Inc. All rights reserved.</p>
            <img src='/images/builtonflow.png' className='img-fluid mx-auto mb-3 mb-sm-0 buildonFlow'></img>
            <ul className="list-unstyled d-flex fs-4 mb-0 justify-content-center">
              <li className="ms-3"><a className="link-dark" href="/"></a><i className="bi bi-facebook text-white link-info"></i></li>
              <li className="ms-3"><a className="link-dark" href="/"></a><i className="bi bi-twitter text-white link-info"></i></li>
              <li className="ms-3"><a className="link-dark" href="/"></a><i className="bi bi-instagram text-white link-info"></i></li>
              <li className="ms-3"><a className="link-dark" href="/"></a><i className="bi bi-linkedin text-white link-info"></i></li>
              <li className="ms-3"><a className="link-dark" href="/"></a><i className="bi bi-youtube text-white link-info"></i></li>
            </ul>
          </div>

        </footer>
      </div>
  
     
  );
};

export default Footer;