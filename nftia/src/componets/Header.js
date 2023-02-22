import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as fcl from "@onflow/fcl";
import './Header.css';



const Header = ({ user }) => {

    //console.log("user", user);


    const AddUserApiCall = async (addr) => {

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
             if (data) {
                console.log("Response from Api", data);
            } else {
                // Handle non-array response
                console.error('Response is not an array');
            }
        })
        .catch((error) => {
            // This function will be called if the Promise is rejected with an error
            console.error("There was an error:", error);
        });  

    }


    const SignUp = () => {
      fcl.signUp
      .then((response) => {
        console.log(response)
        // Process the response as needed
      })
      .catch((error) => {
        console.error(error)
        // Handle the error as needed
      })

    }

    const LogIn = () => {
      fcl.logIn()
      .then((response) => {
        console.log("Response from Login", response);

        await AddUserApiCall(response.addr)
        .then((apiResponse) => {
          console.log("Response from Api Call", apiResponse);
        })
        .catch((error) => {
          console.error("Error from Api Call", error);
          // Handle the error as needed
        })

        console.log("ADD", address);



        // Process the response as needed
      })
      .catch((error) => {
        console.error("Error from Login", error);
        // Handle the error as needed
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
          <button className="btn btn-outline-info btn-lg btn-block" onClick={LogIn}>Log In</button>
          <button className="btn btn-outline-info btn-lg btn-block" onClick={SignUp}>Sign Up</button>
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