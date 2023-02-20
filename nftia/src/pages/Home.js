import React from 'react';
import Hero from '../componets/Hero';
import Trending from '../componets/Trending';
import Info from '../componets/Info';
import Steps from '../componets/Steps';

const Home = () => {
  return (
    <div>
      <Hero />
      <Trending />
      <Info />
      <Steps />
    </div>
  );
};

export default Home;
