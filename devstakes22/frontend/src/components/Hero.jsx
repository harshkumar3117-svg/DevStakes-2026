import React, { useState, useEffect } from 'react';
import { Play, Plus, Info, Star, Check } from 'lucide-react';
import { getBackdropUrl, getPosterUrl, getGenreNames } from '../services/apiService';
import { useNavigate } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';

const Hero = ({ movies, loading }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const { toggleWatchlist, isInWatchlist } = useWatchlist();
    const movie = movies[currentIndex];
    const isAdded = movie ? isInWatchlist(movie.id) : false;

    const handleToggle = (e) => {
        e.stopPropagation();
        if (movie) toggleWatchlist(movie);
    };

    useEffect(() => {
        if (movies.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
        }, 8000);
        return () => clearInterval(interval);
    }, [movies]);

    if (!movie && loading) return (
        <section className="hero-section" style={{ height: '70vh' }}>
            <div className="hero-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="spinner"></div>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading cinematic experience...</p>
                </div>
            </div>
        </section>
    );

    if (!movie && !loading) return (
        <section className="hero-section" style={{ height: '70vh' }}>
            <div className="hero-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', maxWidth: '600px' }}>
                    <h2 className="hero-title gradient-text" style={{fontSize: '2rem'}}>Welcome to CineStream</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                        Our cinematic database is temporarily catching its breath. 
                        Please check your network connection or try again in a moment.
                    </p>
                    <button className="btn-primary" style={{marginTop: '2rem'}} onClick={() => window.location.reload()}>
                        Refresh Experience
                    </button>
                </div>
            </div>
        </section>
    );

    const backdropUrl = getBackdropUrl(movie.backdrop_path);
    const genreNames = getGenreNames(movie.genre_ids);

    return (
        <section className="hero-section">
            <div 
                className="hero-bg" 
                style={{ 
                    backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
                    background: !backdropUrl ? 'linear-gradient(135deg, #1a0533 0%, #050510 40%, #0a1628 100%)' : undefined
                }}
            ></div>
            <div className="hero-overlay"></div>
            
            <div className="hero-content">
                <div className="hero-left">
                    <div className="hero-badge pulse-badge">RECOMMENDED FOR YOU</div>
                    <h1 className="hero-title gradient-text">{movie.title || movie.name}</h1>
                    
                    <div className="hero-movie-info">
                        <div className="hero-tags">
                            <span className="tag-pill">U/A 16+</span>
                            <span className="tag-pill">{(movie.release_date || movie.first_air_date || '').split('-')[0]}</span>
                            <span className="tag-pill">4K Ultra HD</span>
                            {genreNames.length > 0 && genreNames.map(g => (
                                <span key={g} className="tag-pill">{g}</span>
                            ))}
                        </div>
                        <div className="hero-rating">
                            <div className="rating-stars">
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} fill="currentColor" />
                                <Star size={16} />
                            </div>
                            <span>{(movie.vote_average || 0).toFixed(1)} TMDB Rating</span>
                        </div>
                    </div>

                    <p className="hero-desc">{movie.overview}</p>

                    <div className="hero-actions">
                        <button 
                            className="btn-primary hero-play glow-btn"
                            onClick={() => navigate(`/detail/${movie.title ? 'movie' : 'tv'}/${movie.id}`)}
                        >
                            <Play size={20} fill="currentColor" /> Watch Now
                        </button>
                        <button 
                            className={`btn-ghost hero-list ${isAdded ? 'active' : ''}`}
                            onClick={handleToggle}
                        >
                            {isAdded ? <Check size={20} /> : <Plus size={20} />} 
                            {isAdded ? ' Added' : ' Add Watchlist'}
                        </button>
                    </div>
                </div>

                <div className="hero-right">
                    <div className="featured-card glass-card">
                        <div className="featured-poster">
                            <img src={getPosterUrl(movie.poster_path, 'w500')} alt={movie.title} />
                            <div className="poster-overlay">
                                <div className="featured-card-info">
                                    <div className="card-meta">
                                        <div className="card-rating">
                                            <Star size={14} fill="currentColor" /> {(movie.vote_average || 0).toFixed(1)}
                                        </div>
                                        <div className="card-genre">{genreNames.join(' • ') || 'Action • Drama'}</div>
                                    </div>
                                    <h3>{movie.title || movie.name}</h3>
                                    <div className="card-actions">
                                        <button className="btn-info-circle" onClick={() => navigate(`/detail/${movie.title ? 'movie' : 'tv'}/${movie.id}`)}>
                                            <Info size={18} />
                                        </button>
                                        <div className="hero-indicators">
                                            {[0,1,2,3,4].map(idx => (
                                                <div 
                                                    key={idx}
                                                    className={`indicator ${currentIndex === idx ? 'active' : ''}`}
                                                    onClick={() => setCurrentIndex(idx)}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="scroll-indicator">
                <div className="scroll-mouse">
                    <div className="scroll-wheel"></div>
                </div>
                <span>SCROLL TO EXPLORE</span>
            </div>
        </section>
    );
};

export default Hero;
