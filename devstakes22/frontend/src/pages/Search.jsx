import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search as SearchIcon, Filter, SlidersHorizontal } from 'lucide-react';
import { searchMovies } from '../services/apiService';
import MovieCard from '../components/MovieCard';

const Search = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q') || '';
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(query);

    useEffect(() => {
        setSearchTerm(query);
        if (query) {
            handleSearch(query);
        }
    }, [query]);

    const handleSearch = async (q) => {
        setLoading(true);
        try {
            const res = await searchMovies(q);
            setResults(res);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-page" style={{paddingTop: '30px'}}>
            <div className="search-page-header glass-card">
                <h1 className="page-title">Search <span className="gradient-text">Database</span></h1>
                
                <div className="advanced-search">
                    <div className="search-main neu-input">
                        <SearchIcon size={20} />
                        <input 
                            type="text" 
                            placeholder="Type to search movies, actors, directors..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
                        />
                    </div>
                    
                    <div className="filter-row">
                        <select className="filter-select neu-input">
                            <option>All Genres</option>
                            <option>Action</option>
                            <option>Comedy</option>
                        </select>
                        <select className="filter-select neu-input">
                            <option>Release Year</option>
                            <option>2024</option>
                            <option>2023</option>
                        </select>
                        <select className="filter-select neu-input">
                            <option>Rating (Any)</option>
                            <option>8.0+</option>
                            <option>7.0+</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="search-results-grid">
                {loading ? (
                    <div className="search-placeholder">Searching...</div>
                ) : results.length > 0 ? (
                    results.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))
                ) : (
                    <div className="search-placeholder">
                        <SearchIcon size={64} />
                        <p>{query ? `No results found for "${query}"` : 'Enter a search term to find movies'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
