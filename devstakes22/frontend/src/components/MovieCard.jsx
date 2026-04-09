import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Info, Star, Bookmark, Check } from 'lucide-react';
import { getPosterUrl } from '../services/apiService';
import { useWatchlist } from '../context/WatchlistContext';

const MovieCard = ({ movie, type }) => {
    const navigate = useNavigate();
    const { toggleWatchlist, isInWatchlist } = useWatchlist();
    const mediaType = type || (movie.title ? 'movie' : 'tv');
    const isAdded = isInWatchlist(movie.id || movie.tmdbId);
    
    const handleClick = () => {
        navigate(`/detail/${mediaType}/${movie.id || movie.tmdbId}`);
    };

    const handleToggle = (e) => {
        e.stopPropagation();
        toggleWatchlist(movie);
    };

    return (
        <div className="movie-card" onClick={handleClick}>
            <div className="movie-card-poster">
                <img src={getPosterUrl(movie.poster_path || movie.posterPath)} alt={movie.title || movie.name} loading="lazy" />
                <div className="card-rating-badge">
                    <Star size={10} fill="currentColor" /> {(movie.vote_average || movie.rating || 0).toFixed(1)}
                </div>
                {mediaType === 'tv' && <div className="type-badge tv">TV</div>}
                {isAdded && <div className="watchlist-badge"><Bookmark size={12} fill="currentColor" /></div>}
                
                <div className="movie-card-overlay">
                    <div className="card-overlay-actions">
                        <button className={`fab-btn ${isAdded ? 'success' : 'primary'}`} onClick={handleToggle}>
                            {isAdded ? <Check size={18} /> : <Plus size={18} />}
                        </button>
                        <button className="fab-btn" onClick={handleClick}>
                            <Play size={18} fill="currentColor" />
                        </button>
                    </div>
                    <div className="card-overlay-info">
                        <h4 className="card-overlay-title">{movie.title || movie.name}</h4>
                        <p className="card-overlay-meta">{(movie.release_date || movie.first_air_date || movie.releaseDate || '').split('-')[0]}</p>
                    </div>
                </div>
            </div>
            <div className="movie-card-info">
                <h4 className="movie-card-title">{movie.title || movie.name}</h4>
                <div className="movie-card-meta">
                    <span>{(movie.release_date || movie.first_air_date || movie.releaseDate || '').split('-')[0]}</span>
                    <span>•</span>
                    <span>{mediaType === 'movie' ? 'Movie' : 'TV Series'}</span>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
