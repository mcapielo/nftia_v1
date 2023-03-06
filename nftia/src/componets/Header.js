import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as fcl from "@onflow/fcl";
import './Header.css';
import UserMessage from './UserMessage'


const Header = ({ user }) => {

    const [loading_auth_button, setLoadingAuthButton] = useState(false);
    const [showSetupUserAlert, setShowSetupUserAlert] = useState(false);

    const navigate = useNavigate();

    const AddUserApiCall = async (addr) => {
        let returning_value = false;

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
          if (data.ok) {
            returning_value =  {"ok": data.ok, "AccountSetUp": data.value?.AccountSetUp? data.value.AccountSetUp : false};
          }
        })
        .catch((error) => {
            console.error("Error:", error);
        });  

        return returning_value;

    }

    const FlagUserSetup = async (addr) => {

      let returning_value = false;

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
  
        const flag_user_setup =  await fetch('/api/flag_user_setup', config)
        .then(response => response.json())
        .then(data => {
        })
        .catch((error) => {
            console.error("There was an error:", error);
        });  

      return returning_value;
    }

    const LogIn = () => {
      setLoadingAuthButton(true);
      fcl.authenticate()
      .then((response) => {
        if (!response.addr) {
          setLoadingAuthButton(false);
          return false;
        }
          AddUserApiCall(response.addr)
          .then((data) => {
            if (data.ok && data.AccountSetUp) {
              setLoadingAuthButton(false);
              navigate('/workshop');
            } else if (data.ok && data.AccountSetUp === false) {
              const responseSetAccount = SetAccount();
              if (responseSetAccount) {
                FlagUserSetup(response.addr);
              }
              setLoadingAuthButton(false);
              navigate('/workshop');
            }
          })
          .catch((error) => {
            console.error("Error from Login", error);
            //Show an Alert saying Maintenance Mode.
            navigate('/maintenance');
          })
        
      })
      .catch((error) => {
        console.error("Error from Login", error);
        //Show an Alert saying Maintenance Mode.
        navigate('/maintenance');
      })

    }

    const SetAccount = async () => {

      setShowSetupUserAlert(true);

      try{
        const setUpUserTRXId = await fcl.mutate({
          cadence: `
            import NFTIA from 0x19e6fc6fdfde98d5
            import NonFungibleToken from 0x631e88ae7f1d7c20
            import FungibleToken from 0x9a0766d93b6608b7
            import FlowToken from 0x7e60df042a9c0868
            import NFTIAMarketPlace from 0x19e6fc6fdfde98d5
        
                transaction () {
        
                    prepare(acct: AuthAccount) {
                    
                        // CREATE A NFTIA COLLECTION ( for Album )
                        acct.save(<- NFTIA.createEmptyCollection() , to: /storage/NFTIACollection)
                        acct.link<&NFTIA.Collection{NFTIA.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/NFTIACollection, target: /storage/NFTIACollection)
                        acct.link<&NFTIA.Collection>(/private/NFTIACollection, target: /storage/NFTIACollection)
                    
                        // CREATE A NFTIA SALE COLLECTION ( for Market Place )
                        let NFTIACollection = acct.getCapability<&NFTIA.Collection>(/private/NFTIACollection)
                        let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
                        acct.save(<- NFTIAMarketPlace.createSaleCollection(NFTIACollection: NFTIACollection, FlowTokenVault: FlowTokenVault), to: /storage/NFTIASaleCollection)
                        acct.link<&NFTIAMarketPlace.SaleCollection{NFTIAMarketPlace.SaleCollectionPublic}>(/public/NFTIASaleCollection, target: /storage/NFTIASaleCollection)
                    }
        
                    execute {
                    log("A user set up happened")
                    }
                }
            `
          ,
          proposer: fcl.authz,
          payer: fcl.authz,
          authorization: [fcl.authz],
          limit: 9999,
        });
        
        const TRId = setUpUserTRXId;
        console.log("https://testnet.flowscan.org/transaction/"+ TRId +"/events")
        
        const setUpUsertransaction = await fcl.tx(TRId).onceSealed();
        return { setUpUsertransaction };
      } catch (error) {
        console.log("Error:", error);
      }
    }

    const AuthedState = () => {
        return (
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
             <li className="nav-item">
             <a href={user && user.addr ? 'https://testnet.flowscan.org/account/'+user.addr : ''} className="nav-link text-white link-info" rel="noreferrer" target="_blank">
              {user && user.addr ? user.addr : ''}
            </a>
            </li>
            <button className="btn btn-outline-info btn-lg btn-block" onClick={fcl.unauthenticate}>Log Out</button>
          </ul>
        )
    }
    
    const UnauthenticatedState = () => {

      return (
        <div>
           {loading_auth_button ? 
           <button class="btn btn-outline-info btn-lg btn-block" type="button" disabled>
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Authenticating...
              </button> 
           : 
            <button className="btn btn-outline-info btn-lg btn-block" id="signInUpButton" onClick={LogIn}>Sign to Enter</button>           
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
        <UserMessage variant="info" time="7000" message="Great!! Last Step and we are ready to craft!!" triggerAlert={showSetupUserAlert} />
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

            {user && user.addr ?
              <li className="nav-item">
              <Link className="nav-link text-white link-info" to="/workshop">Workshop</Link>
              </li>
            :
              ""
            }

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