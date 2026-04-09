import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import MovieCard from './MovieCard';

const MovieRow = ({ title, movies, loading, isAi, type, icon }) => {
    const rowRef = useRef(null);

    const scroll = (direction) => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <section className="movie-section">
            <div className="section-header">
                <h2 className="section-title">
                    {icon && <span className="section-icon">{icon}</span>}
                    {title}
                    {isAi && (
                        <span className="ai-badge">
                            <Sparkles size={14} />  CURATED
                        </span>
                    )}
                </h2>
                <span className="see-all">See All <ChevronRight size={16} /></span>
            </div>

            <div className="movie-row-wrapper">
                <button className="scroll-btn left" onClick={() => scroll('left')}>
                    <ChevronLeft size={24} />
                </button>
                
                <div className="movie-row" ref={rowRef}>
                    {loading ? (
                        <div className="row-loading">Loading suggestions...</div>
                    ) : (
                        movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} type={type} />
                        ))
                    )}
                </div>

                <button className="scroll-btn right" onClick={() => scroll('right')}>
                    <ChevronRight size={24} />
                </button>
            </div>
        </section>
    );
};

export default MovieRow;
