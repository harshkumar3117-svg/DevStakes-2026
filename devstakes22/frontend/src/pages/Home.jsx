import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { 
    fetchTrending, 
    fetchPopular, 
    fetchTopRated, 
    fetchNowPlaying,
    fetchActionMovies,
    fetchRomanceMovies,
    fetchScifiMovies,
    fetchHorrorMovies,
    fetchComedyMovies,
    fetchAnimationMovies,
    fetchDramaMovies,
    fetchThrillerMovies,
    recommendationEngine
} from '../services/apiService';

const Home = () => {
    // Basic categorires
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [nowPlaying, setNowPlaying] = useState([]);
    
    // Genre categories
    const [action, setAction] = useState([]);
    const [scifi, setScifi] = useState([]);
    const [horror, setHorror] = useState([]);
    const [comedy, setComedy] = useState([]);
    const [animation, setAnimation] = useState([]);
    const [romance, setRomance] = useState([]);
    const [drama, setDrama] = useState([]);
    const [thriller, setThriller] = useState([]);

    // AI Recommended
    const [recommended, setRecommended] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Initial load similar to devstakes initHomePage
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

                // Load genre rows with small delays like devstakes
                fetchActionMovies().then(setAction);
                fetchScifiMovies().then(setScifi);
                fetchHorrorMovies().then(setHorror);
                fetchComedyMovies().then(setComedy);
                fetchAnimationMovies().then(setAnimation);
                fetchRomanceMovies().then(setRomance);
                fetchDramaMovies().then(setDrama);
                fetchThrillerMovies().then(setThriller);

                // Load personalized recommendations if behavior exists
                recommendationEngine.getPersonalizedRecommendations().then(setRecommended);

            } catch (error) {
                console.error('Failed to load home data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <main className="home-page">
            <Hero movies={trending} loading={loading} />
            
            <div className="sections-container">
                <MovieRow title="Trending Now" movies={trending} loading={loading} icon="🔥" />
                <MovieRow title="Popular Movies" movies={popular} loading={loading} icon="⭐" />
                
                {recommended.length > 0 && (
                    <MovieRow title="Recommended For You" movies={recommended} loading={loading} icon="🤖" isAi={true} />
                )}

                <MovieRow title="Top Rated All Time" movies={topRated} loading={loading} icon="🏆" />
                <MovieRow title="Now Playing in Theaters" movies={nowPlaying} loading={loading} icon="🎭" />

                {/* Genre Rows */}
                <MovieRow title="Action & Adventure" movies={action} loading={loading} icon="💥" />
                <MovieRow title="Sci-Fi & Fantasy" movies={scifi} loading={loading} icon="🚀" />
                <MovieRow title="Horror & Thriller" movies={horror} loading={loading} icon="👻" />
                <MovieRow title="Comedy" movies={comedy} loading={loading} icon="😂" />
                <MovieRow title="Animation" movies={animation} loading={loading} icon="🎨" />
                <MovieRow title="Romance" movies={romance} loading={loading} icon="❤️" />
                <MovieRow title="Drama" movies={drama} loading={loading} icon="🎭" />
                <MovieRow title="Thriller" movies={thriller} loading={loading} icon="🔪" />
            </div>

            {/* Stats section from original index.html */}
            <section className="stats-banner">
                <div className="stats-container glass-card">
                    <div className="stat-item">
                        <span className="stat-number gradient-text">10M+</span>
                        <span className="stat-label">Movies & Shows</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number gradient-text">50K+</span>
                        <span className="stat-label">Happy Users</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number gradient-text">99%</span>
                        <span className="stat-label">Accuracy Rate</span>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <span className="stat-number gradient-text">AI</span>
                        <span className="stat-label">Powered Engine</span>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
