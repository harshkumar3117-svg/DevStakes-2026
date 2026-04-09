import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, User as UserIcon, LogOut, Heart, LayoutGrid, MessageSquare, Menu, X } from 'lucide-react';

const Navbar = ({ scrolled }) => {
    const { user, logout, setShowLogin } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery}`);
            setSearchQuery('');
        }
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className={`navbar glass-nav ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-container">
                <div className="nav-left">
                    <Link to="/" className="logo">
                        CINE<span className="logo-accent">STREAM</span>
                    </Link>
                    
                    <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                        <li><Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setIsMenuOpen(false)}>Home</Link></li>
                        <li><Link to="/movies" className={`nav-link ${isActive('/movies')}`} onClick={() => setIsMenuOpen(false)}>Movies</Link></li>
                        <li><Link to="/series" className={`nav-link ${isActive('/series')}`} onClick={() => setIsMenuOpen(false)}>Series</Link></li>
                        <li><Link to="/community" className={`nav-link ${isActive('/community')}`} onClick={() => setIsMenuOpen(false)}>Community</Link></li>
                        {user && <li><Link to="/watchlist" className={`nav-link ${isActive('/watchlist')}`} onClick={() => setIsMenuOpen(false)}>Watchlist</Link></li>}
                    </ul>
                </div>

                <div className="nav-right">
                    <div className="search-container">
                        <form onSubmit={handleSearch} className="search-box neu-input">
                            <Search size={18} />
                            <input 
                                type="text" 
                                placeholder="Search movies, tv shows..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>

                    <div className="auth-buttons">
                        <button className="icon-btn">
                            <Bell size={18} />
                            <span className="notif-badge">0</span>
                        </button>

                        {user ? (
                            <div className="user-profile">
                                <div className="avatar-wrapper" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                                    <div className="avatar">{user.firstName?.[0] || user.email[0].toUpperCase()}</div>
                                    <span>{user.firstName || 'User'}</span>
                                </div>
                                
                                {isProfileOpen && (
                                    <div className="profile-menu visible">
                                        <Link to="/watchlist" onClick={() => setIsProfileOpen(false)}>
                                            <Heart size={16} /> My Watchlist
                                        </Link>
                                        <Link to="/community" onClick={() => setIsProfileOpen(false)}>
                                            <LayoutGrid size={16} /> Activity
                                        </Link>
                                        <a href="#" onClick={() => { logout(); setIsProfileOpen(false); }}>
                                            <LogOut size={16} /> Sign Out
                                        </a>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button className="btn-primary" onClick={() => setShowLogin(true)}>
                                Sign In
                            </button>
                        )}
                    </div>

                    <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
