import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as fcl from "@onflow/fcl";
import './Header.css';



const Header = ({ user }) => {

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const AddUserApiCall = async (addr) => {
        let returning_value;

        const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            address: addr
          })
        }
  
        const add_User =  await fetch('/api/add_user', config)
        .then(response => response.json())
        .then(data => {
          console.log("Should return this",data.ok);
          returning_value =  data.ok;
        })
        .catch((error) => {
            // This function will be called if the Promise is rejected with an error
            console.error("There was an error:", error);
        });  

        return returning_value;

    }

    const LogIn = () => {
      setLoading(true);
      fcl.authenticate()
      .then((response) => {
        console.log("Response from Login", response);
          AddUserApiCall(response.addr)
          .then((data) => {
            console.log("Response from Api Call", data);
            if (data) {
              setLoading(false);
              navigate('/workshop');
            }
          })
          .catch((error) => {
            console.error("Error from Login", error);
            //Show an Alert saying Maintenance Mode.
            navigate('/maitenance');
          })
        
      })
      .catch((error) => {
        console.error("Error from Login", error);
        //Show an Alert saying Maintenance Mode.
        navigate('/maitenance');
      })

    }

    const AuthedState = () => {
        return (
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
             <li className="nav-item">
             <a href={user && user.addr ? 'https://testnet.flowscan.org/account/'+user.addr : ''} className="nav-link text-white link-info" rel="noreferrer" target="_blank">
              {user && user.addr ? user.addr : ''}
            </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white link-info" to="/workshop">Workshop</Link>
            </li>
            <button className="btn btn-outline-info btn-lg btn-block" onClick={fcl.unauthenticate}>Log Out</button>
          </ul>
        )
    }
    
    const UnauthenticatedState = () => {

      return (
        <div>
           {loading ? 
           <button class="btn btn-outline-info btn-lg btn-block" type="button" disabled>
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Authenticating...
              </button> 
           : 
            <button className="btn btn-outline-info btn-lg btn-block" onClick={LogIn}>Sign InUp</button>           
           }
        </div>
      )
    }

   

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">
        <Link className="navbar-brand text-white" to="/">
          <img src="/images/logo-nftia.png" className="img-fluid rounded-circle rounded-sm mx-2 mx-md-4 Header-logo" alt="NFTIA LOGO"/>
          <h1>NFTIA</h1>
          <h6><span className="badge rounded-pill text-bg-info">Testnet - Beta</span></h6> 
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-white link-info" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white link-info" to="/marketplace">MarketPlace</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              {user?.addr ? 
                <AuthedState />
               :
                <UnauthenticatedState /> 
              }
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;