import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        if (user) {
            fetchWatchlist();
        } else {
            setWatchlist([]);
        }
    }, [user]);

    const fetchWatchlist = async () => {
        try {
            const res = await fetch(`http://localhost:8080/api/watchlist/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setWatchlist(data);
            }
        } catch (error) {
            console.error('Failed to fetch watchlist from backend', error);
        }
    };

    const toggleWatchlist = async (item) => {
        if (!user) return false;

        const itemData = {
            tmdbId: item.id || item.tmdbId,
            title: item.title || item.name,
            posterPath: item.poster_path || item.posterPath,
            mediaType: item.media_type || (item.title ? 'movie' : 'tv'),
            rating: item.vote_average || item.rating,
            releaseDate: item.release_date || item.first_air_date || item.releaseDate,
        };

        try {
            const res = await fetch(`http://localhost:8080/api/watchlist/${user.id}/toggle`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(itemData),
            });
            if (res.ok) {
                const data = await res.json();
                setWatchlist(data);
                return true;
            }
        } catch (error) {
            console.error('Failed to toggle watchlist on backend', error);
        }
        return false;
    };

    const isInWatchlist = (tmdbId) => {
        return watchlist.some(item => (item.id || item.tmdbId) === tmdbId);
    };

    return (
        <WatchlistContext.Provider value={{ watchlist, toggleWatchlist, isInWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
};

export const useWatchlist = () => useContext(WatchlistContext);
