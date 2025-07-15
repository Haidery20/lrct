import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Adventures from './components/Adventures';
import Events from './components/Events';
import Membership from './components/Membership';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

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
      </main>
      <Footer />
    </div>
  );
}

export default App;