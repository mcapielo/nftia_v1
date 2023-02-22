import React from 'react';
import { Navigate } from 'react-router-dom';
import * as fcl from "@onflow/fcl";

import CreateArtForm from '../componets/CreateArtForm';
import Album from '../componets/Album';


const Workshop = ({ user }) => {

  if ( !user || !user.addr || !user.loggedIn ) {
    return <Navigate to="/" />;
 };

//  fcl.send([fcl.getAccount(user.addr)])
//   .then(userAccount => {
//     console.log(userAccount.contracts);
//     const hasCollection = userAccount?.contracts?.hasOwnProperty('my_collection');

//     console.log("Has Collection", hasCollection)

//     if (hasCollection) {
//     // The user has the necessary collection
//     } else {
//     // The user is missing the necessary collection
//     }
//   })
//   .catch(error => {
// // Handle errors here
//   });





return (
  <div>
    <CreateArtForm user={user}/>
    <Album user={user}/>
  </div>
);
};

export default Workshop;
