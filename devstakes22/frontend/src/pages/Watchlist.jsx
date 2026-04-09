import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';
import { Bookmark, Popcorn } from 'lucide-react';

const Watchlist = () => {
    const { watchlist } = useWatchlist();
    const { user, setShowLogin } = useAuth();

    if (!user) {
        return (
            <div className="page-hero">
                <div className="watchlist-container text-center" style={{paddingTop: '3rem'}}>
                    <div className="empty-watchlist show">
                        <Bookmark size={60} className="empty-icon text-muted" />
                        <h3>Sign in to view your watchlist</h3>
                        <p>Keep track of all the movies and shows you want to watch in one place.</p>
                        <button className="btn-primary" onClick={() => setShowLogin(true)}>Sign In Now</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page-hero">
            <div className="watchlist-container">
                <h1 className="page-title">My <span className="gradient-text">Watchlist</span></h1>
                <p className="modal-subtitle" style={{textAlign: 'left', marginBottom: '3rem'}}>
                    You have {watchlist.length} titles saved to your collection
                </p>

                {watchlist.length === 0 ? (
                    <div className="empty-watchlist show">
                        <Popcorn size={60} className="empty-icon text-muted" />
                        <h3>Your watchlist is empty</h3>
                        <p>Explore our library and add movies or shows to your list to watch them later.</p>
                        <button className="btn-primary">Browse Trending</button>
                    </div>
                ) : (
                    <div className="watchlist-grid">
                        {watchlist.map(item => (
                            <MovieCard key={item.tmdbId} movie={item} type={item.mediaType} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Watchlist;
