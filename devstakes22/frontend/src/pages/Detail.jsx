import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Plus, Star, ChevronLeft, Clock, Calendar, Globe } from 'lucide-react';
import { 
    fetchMovieDetails, 
    fetchSeriesDetails, 
    getBackdropUrl, 
    getPosterUrl, 
    getProfileUrl, 
    get2EmbedUrl
} from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useWatchlist } from '../context/WatchlistContext';
import MovieRow from '../components/MovieRow';

const Detail = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const { user, setShowLogin } = useAuth();
    const { toggleWatchlist, isInWatchlist } = useWatchlist();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDetails = async () => {
            setLoading(true);
            try {
                const res = type === 'movie' ? await fetchMovieDetails(id) : await fetchSeriesDetails(id);
                setData(res);
            } catch (error) {
                console.error('Failed to load details', error);
            } finally {
                setLoading(false);
            }
        };
        loadDetails();
        window.scrollTo(0, 0);
    }, [type, id]);

    if (loading) return <div className="detail-loading"><div className="spinner"></div>Loading Cinematic Experience...</div>;
    if (!data || !data.details) return <div className="detail-loading">Content not found. The API may be temporarily unavailable.</div>;

    const { details, credits, similar } = data;

    return (
        <div className="movie-detail-page">
            <div 
                className="movie-detail-backdrop" 
                style={{ backgroundImage: `url(${getBackdropUrl(details.backdrop_path)})` }}
            >
                <div className="backdrop-overlay"></div>
            </div>

            <div className="movie-detail-content">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={18} /> Back to Browse
                </button>

                <div className="movie-detail-grid">
                    <div className="detail-poster">
                        <img src={getPosterUrl(details.poster_path, 'w500')} alt={details.title || details.name} />
                    </div>

                    <div className="detail-info">
                        <h1 className="detail-title">{details.title || details.name}</h1>
                        
                        <div className="detail-meta-row">
                            <div className="detail-rating">
                                <Star size={18} fill="currentColor" /> {details.vote_average?.toFixed(1)}
                            </div>
                            <span>•</span>
                            <div className="detail-meta-item"><Clock size={16} /> {details.runtime || details.episode_run_time?.[0]} min</div>
                            <span>•</span>
                            <div className="detail-meta-item"><Calendar size={16} /> {(details.release_date || details.first_air_date || '').split('-')[0]}</div>
                            <span>•</span>
                            <div className="detail-meta-item"><Globe size={16} /> {details.original_language?.toUpperCase()}</div>
                        </div>

                        <div className="detail-genres">
                            {details.genres?.map(g => (
                                <span key={g.id} className="genre-tag">{g.name}</span>
                            ))}
                        </div>

                        <p className="detail-overview">{details.overview}</p>

                        <div className="detail-actions">
                            <button className="btn-primary" onClick={() => {
                                document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' });
                            }}>
                                <Play size={20} fill="currentColor" /> Watch Now
                            </button>
                            <button className="btn-ghost" onClick={() => {
                                if (!user) {
                                    setShowLogin(true);
                                } else {
                                    toggleWatchlist(details);
                                }
                            }}>
                                <Plus size={20} /> {isInWatchlist(details.id) ? 'In Watchlist' : 'Add to Watchlist'}
                            </button>
                        </div>

                        <div className="player-section" id="player">
                            <div className="trailer-container">
                                <iframe 
                                    src={get2EmbedUrl(details.id, type)}
                                    title="Movie Player"
                                    allowFullScreen
                                    allow="autoplay"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="cast-section" style={{marginTop: '4rem'}}>
                    <h3 className="detail-section-title">Principal Cast</h3>
                    <div className="cast-row">
                        {credits.cast?.slice(0, 12).map(person => (
                            <div key={person.id} className="cast-card">
                                <div className="cast-photo">
                                    <img src={getProfileUrl(person.profile_path)} alt={person.name} />
                                </div>
                                <div className="cast-name">{person.name}</div>
                                <div className="cast-character">{person.character}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <MovieRow title="More Like This" movies={similar} type={type} />
            </div>
        </div>
    );
};

export default Detail;
