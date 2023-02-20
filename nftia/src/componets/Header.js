import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as fcl from "@onflow/fcl";
import './Header.css';



const Header = ({ user }) => {

    //console.log("user", user);

    const AuthedState = () => {
        return (
          <ul>
             <li className="nav-item">
             <a href={user && user.addr ? 'https://testnet.flowscan.org/account/'+user.addr : ''} className="nav-link text-white link-info" rel="noreferrer" target="_blank">
              {user && user.addr ? user.addr : ''}
            </a>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/workshop">Workshop</Link>
            </li>
            <button className="btn btn-outline-info btn-lg btn-block" onClick={fcl.unauthenticate}>Log Out</button>
          </ul>
        )
      }
    
    const UnauthenticatedState = () => {
      return (
        <div>
          <button className="btn btn-outline-info btn-lg btn-block" onClick={fcl.logIn}>Log In</button>
          <button className="btn btn-outline-info btn-lg btn-block" onClick={fcl.signUp}>Sign Up</button>
        </div>
      )
    }

   

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
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
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/marketplace">MarketPlace</Link>
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