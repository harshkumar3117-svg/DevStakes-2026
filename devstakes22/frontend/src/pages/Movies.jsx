import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { 
    fetchTrending, 
    fetchPopular, 
    fetchTopRated, 
    fetchNowPlaying,
    fetchActionMovies,
    fetchScifiMovies,
    fetchHorrorMovies,
    fetchComedyMovies,
    fetchAnimationMovies,
    fetchRomanceMovies,
    fetchDramaMovies,
    fetchThrillerMovies
} from '../services/apiService';

const Movies = () => {
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [nowPlaying, setNowPlaying] = useState([]);
    
    const [action, setAction] = useState([]);
    const [scifi, setScifi] = useState([]);
    const [horror, setHorror] = useState([]);
    const [comedy, setComedy] = useState([]);
    const [animation, setAnimation] = useState([]);
    const [romance, setRomance] = useState([]);
    const [drama, setDrama] = useState([]);
    const [thriller, setThriller] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [t, p, tr, np] = await Promise.all([
                    fetchTrending(),
                    fetchPopular(),
                    fetchTopRated(),
                    fetchNowPlaying()
                ]);
                setTrending(t);
                setPopular(p);
                setTopRated(tr);
                setNowPlaying(np);

                // Genre rows for movies
                fetchActionMovies().then(setAction);
                fetchScifiMovies().then(setScifi);
                fetchHorrorMovies().then(setHorror);
                fetchComedyMovies().then(setComedy);
                fetchAnimationMovies().then(setAnimation);
                fetchRomanceMovies().then(setRomance);
                fetchDramaMovies().then(setDrama);
                fetchThrillerMovies().then(setThriller);

            } catch (error) {
                console.error('Failed to load movies data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <main className="movies-page">
            <Hero movies={trending.slice(0, 6)} loading={loading} />
            
            <div className="sections-container">
                <MovieRow title="Trending Now" movies={trending} loading={loading} icon="🔥" />
                <MovieRow title="Popular Hits" movies={popular} loading={loading} icon="⭐" />
                <MovieRow title="Top Rated Classics" movies={topRated} loading={loading} icon="🏆" />
                <MovieRow title="Now in Theaters" movies={nowPlaying} loading={loading} icon="🎭" />

                <MovieRow title="Action & Adventure" movies={action} loading={loading} icon="💥" />
                <MovieRow title="Sci-Fi & Fantasy" movies={scifi} loading={loading} icon="🚀" />
                <MovieRow title="Horror & Thriller" movies={horror} loading={loading} icon="👻" />
                <MovieRow title="Comedy" movies={comedy} loading={loading} icon="😂" />
                <MovieRow title="Animation" movies={animation} loading={loading} icon="🎨" />
                <MovieRow title="Romance" movies={romance} loading={loading} icon="❤️" />
                <MovieRow title="Drama" movies={drama} loading={loading} icon="🎭" />
                <MovieRow title="Thriller" movies={thriller} loading={loading} icon="🔪" />
            </div>
        </main>
    );
};

export default Movies;
