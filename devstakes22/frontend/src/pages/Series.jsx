import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import MovieRow from '../components/MovieRow';
import { 
    fetchTrendingSeries, 
    fetchPopularSeries, 
    fetchTopRatedSeries, 
    fetchOnAirSeries,
    fetchActionSeries,
    fetchDramaSeries,
    fetchComedySeries,
    fetchCrimeSeries,
    fetchScifiSeries,
    fetchAnimeSeries
} from '../services/apiService';

const Series = () => {
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [onAir, setOnAir] = useState([]);
    
    const [action, setAction] = useState([]);
    const [drama, setDrama] = useState([]);
    const [comedy, setComedy] = useState([]);
    const [crime, setCrime] = useState([]);
    const [scifi, setScifi] = useState([]);
    const [anime, setAnime] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [t, p, tr, oa] = await Promise.all([
                    fetchTrendingSeries(),
                    fetchPopularSeries(),
                    fetchTopRatedSeries(),
                    fetchOnAirSeries()
                ]);
                setTrending(t);
                setPopular(p);
                setTopRated(tr);
                setOnAir(oa);

                // Genre rows for series
                fetchActionSeries().then(setAction);
                fetchDramaSeries().then(setDrama);
                fetchComedySeries().then(setComedy);
                fetchCrimeSeries().then(setCrime);
                fetchScifiSeries().then(setScifi);
                fetchAnimeSeries().then(setAnime);

            } catch (error) {
                console.error('Failed to load series data', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <main className="series-page">
            <Hero movies={trending.slice(0, 6)} loading={loading} type="tv" />
            
            <div className="sections-container">
                <MovieRow title="Popular Series" movies={popular} loading={loading} type="tv" icon="⭐" />
                <MovieRow title="Trending Series" movies={trending} loading={loading} type="tv" icon="🔥" />
                <MovieRow title="Top Rated All Time" movies={topRated} loading={loading} type="tv" icon="🏆" />
                <MovieRow title="Currently On Air" movies={onAir} loading={loading} type="tv" icon="📶" />

                <MovieRow title="Action & Adventure Series" movies={action} loading={loading} type="tv" icon="💥" />
                <MovieRow title="Drama Series" movies={drama} loading={loading} type="tv" icon="🎭" />
                <MovieRow title="Comedy Series" movies={comedy} loading={loading} type="tv" icon="😂" />
                <MovieRow title="Crime & Mystery" movies={crime} loading={loading} type="tv" icon="🕵️" />
                <MovieRow title="Sci-Fi & Fantasy Series" movies={scifi} loading={loading} type="tv" icon="🚀" />
                <MovieRow title="Anime" movies={anime} loading={loading} type="tv" icon="🌸" />
            </div>
        </main>
    );
};

export default Series;
