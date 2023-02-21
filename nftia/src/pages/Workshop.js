import React from 'react';

import CreateArtForm from '../componets/CreateArtForm';

const Workshop = (props) => {


  return (
    <div>
      <CreateArtForm user={props.user}/>
    </div>
  );
};

export default Workshop;
