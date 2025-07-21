import React from 'react';
import Hero from '../components/Hero';
import Adventures from '../pages/Festivals';
import Events from '../pages/Events';
import Membership from '../pages/Membership';
import Contact from '../pages/Contact';
import Festivals from '../pages/Festivals';
import Partners from '../pages/Partners';

const Home = () => {
  return (
    <>
      <Hero />
      <Events />
      <Contact />
      <Partners />
    </>
  );
};

export default Home;