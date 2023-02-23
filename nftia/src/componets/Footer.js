import { useState } from 'react';
import UserMessage from './UserMessage'

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
            <div className="col-6 col-md-2 mb-3">
              <h5>PRODUCT</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Features</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">How it Works</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">Pricing</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">MarketPlace</a></li>
                <li className="nav-item mb-2"><a href="#" className="nav-link p-0 text-muted">AnotherSector</a></li>
              </ul>
            </div>

            <div className="col-6 col-md-2 mb-3">
              <h5>HELP</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted">Community</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted">Youtube</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted">Blog</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted">FAQs</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted">Docs</a></li>
              </ul>
            </div>

            <div className="col-6 col-md-2 mb-3">
              <h5>COMPANY</h5>
              <ul className="nav flex-column">
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted">About Us</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted">Contact Us</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted">Terms of Service</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted">Privacy Policy</a></li>
                <li className="nav-item mb-2"><a href="/" className="nav-link p-0 text-muted">MarketPlace Terms of Service</a></li>
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
                  <UserMessage variant="info" message="Thank you, Now you are subscribed!" triggerAlert={showAlert} />
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top">
            <p>&copy; 2023 NFTIA, Inc. All rights reserved.</p>
            <ul className="list-unstyled d-flex">
              <li className="ms-3"><a className="link-dark" href="/"></a></li>
              <li className="ms-3"><a className="link-dark" href="/"></a></li>
              <li className="ms-3"><a className="link-dark" href="/"></a></li>
            </ul>
          </div>
        </footer>
      </div>
  
     
  );
};

export default Footer;