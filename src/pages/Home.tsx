import React from 'react';
import Hero from '../components/Hero';
import Adventures from '../components/Adventures';
import Events from '../pages/Events';
import Membership from '../pages/Membership';
import Contact from '../pages/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <Adventures />
      <Events />
      <Membership />
      <Contact />
    </>
  );
};

export default Home;