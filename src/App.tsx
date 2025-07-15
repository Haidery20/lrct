import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Adventures from './components/Adventures';
import Events from './components/Events';
import Membership from './components/Membership';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Gallery from './components/Gallery';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Adventures />
        <Events />
        <Membership />
        <About />
        <Contact />
        <Gallery />
      </main>
      <Footer />
    </div>
  );
}

export default App;