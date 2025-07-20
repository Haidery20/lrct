import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Membership from './pages/Membership';
import Events from './pages/Events';
import Festivals from './pages/Festivals';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/About" element={<About />} />
            <Route path="/Gallery" element={<Gallery />} />
            <Route path="/Membership" element={<Membership />} />
            <Route path="/Events" element={<Events />} />
            <Route path="/Festivals" element={<Festivals />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;