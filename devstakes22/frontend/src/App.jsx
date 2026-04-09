import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Watchlist from './pages/Watchlist';
import Search from './pages/Search';
import Community from './pages/Community';
import Detail from './pages/Detail';
import AuthModals from './components/AuthModals';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import { ToastProvider } from './context/ToastContext';
import ParallaxStars from './components/ParallaxStars';
import './index.css';

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <WatchlistProvider>
            <div className="app">
              <ParallaxStars />
              <Navbar scrolled={scrolled} />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/series" element={<Series />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/search" element={<Search />} />
                <Route path="/community" element={<Community />} />
                <Route path="/detail/:type/:id" element={<Detail />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              <AuthModals />
              
              {/* Background elements preserved from original */}
              <div className="parallax-stars"></div>
            </div>
          </WatchlistProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
