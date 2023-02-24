import React from 'react';
import { Navigate } from 'react-router-dom';
import * as fcl from "@onflow/fcl";

import CreateArtForm from '../componets/CreateArtForm';
import Album from '../componets/Album';


const Workshop = ({ user }) => {

  if ( !user || !user.addr || !user.loggedIn ) {
    return <Navigate to="/" />;
 };

return (
  <div>
    <CreateArtForm user={user}/>
    <Album user={user}/>
  </div>
);
};

export default Workshop;
