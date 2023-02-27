import React from 'react';
import SaleCollections from '../componets/SaleCollections';

const MarketPlace = ({ user }) => {
  return (
    <div>
      <SaleCollections user={user} />
    </div>
  );
};

export default MarketPlace;
