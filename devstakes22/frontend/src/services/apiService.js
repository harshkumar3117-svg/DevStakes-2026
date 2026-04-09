const TMDB_BASE = 'https://api.tmdb.org/3';
const TMDB_IMAGE = 'https://image.tmdb.org/t/p';

// Multiple TMDB v3 API Keys — rotates on 401/timeout
const API_KEYS = [
    '8265bd1679663a7ea12ac168da84d2e8',
    '4bc3b96f8c02fccbc24d15e0fb8d4ae8',
    '648f62289bc29b9954168107414a0d69',
    '2dca580c2a14b55200e784d157207b4d',
    'f6fd7e9f36e14af37e6ab4e3e3c97f3a',
    '23d45c82db6d8958c89c8a9aacc78da3',
    '15d2ea6d0dc1d476efbaca3eca2bf768',
    'b69de959ccce4ed3782ae446e995fb42',
];
let currentKeyIndex = 0;

// =============================
// CACHE
// =============================
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000;
function getCached(key) { const i = cache.get(key); return (i && Date.now()-i.time<CACHE_TTL) ? i.data : null; }
function setCache(key, data) { cache.set(key, {data, time:Date.now()}); }

// =============================
// CORE FETCHER (retry + key rotation)
// =============================
export async function tmdbFetch(endpoint, params = {}, retries = 2) {
    const cacheKey = endpoint + JSON.stringify(params);
    const cached = getCached(cacheKey);
    if (cached) return cached;

    for (let attempt = 0; attempt <= retries; attempt++) {
        const key = API_KEYS[(currentKeyIndex + attempt) % API_KEYS.length];
        const url = new URL(`${TMDB_BASE}${endpoint}`);
        url.searchParams.set('api_key', key);
        url.searchParams.set('language', 'en-US');
        Object.entries(params).forEach(([k,v]) => {
            if (v !== undefined && v !== null && v !== '') url.searchParams.set(k,v);
        });

        try {
            const ctrl = new AbortController();
            const tid = setTimeout(() => ctrl.abort(), 12000); // Increased timeout
            const res = await fetch(url.toString(), {signal: ctrl.signal});
            clearTimeout(tid);

            if (res.status === 401) { 
                console.warn(`TMDB API Key 401 for ${endpoint}. Rotating key...`);
                currentKeyIndex++; 
                continue; 
            }
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            
            // Filter out items without posters/backdrops if it's a list response
            if (data.results && Array.isArray(data.results)) {
                data.results = data.results.filter(m => m.poster_path && m.backdrop_path);
            }

            setCache(cacheKey, data);
            return data;
        } catch (e) {
            console.warn(`TMDB fetch error for ${endpoint}:`, e.message);
            if (attempt < retries) await new Promise(r => setTimeout(r, 400));
        }
    }
    return null;
}

// =============================
// IMAGE HELPERS
// =============================
export function getPosterUrl(path, size='w342') { 
    return path ? `${TMDB_IMAGE}/${size}${path}` : 'https://images.unsplash.com/photo-1485846234645-a62644ef7467?q=80&w=2000&auto=format&fit=crop'; 
}
export function getBackdropUrl(path, size='w1280') { 
    return path ? `${TMDB_IMAGE}/${size}${path}` : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2000&auto=format&fit=crop'; 
}
export function getProfileUrl(path, size='w185') { return path ? `${TMDB_IMAGE}/${size}${path}` : 'https://placehold.co/70x70/0a0a1a/8B5CF6?text=?'; }

// =============================
// MOVIE FETCH — Each section uses its own dedicated API call
// =============================
export async function fetchTrending(w='week') { return (await tmdbFetch(`/trending/movie/${w}`))?.results || []; }
export async function fetchPopular(page=1) { return (await tmdbFetch('/movie/popular',{page}))?.results || []; }
export async function fetchTopRated(page=1) { return (await tmdbFetch('/movie/top_rated',{page}))?.results || []; }
export async function fetchNowPlaying(page=1) { return (await tmdbFetch('/movie/now_playing',{page}))?.results || []; }

export async function fetchByGenre(genreId, page=1) {
    return (await tmdbFetch('/discover/movie',{with_genres:genreId,sort_by:'popularity.desc',page,'vote_count.gte':100}))?.results || [];
}

// Genre-specific APIs (each row has its own dedicated endpoint)
export async function fetchActionMovies(p=1) { return (await tmdbFetch('/discover/movie',{with_genres:28,sort_by:'popularity.desc',page:p,'vote_count.gte':200}))?.results||[]; }
export async function fetchRomanceMovies(p=1) { return (await tmdbFetch('/discover/movie',{with_genres:10749,sort_by:'popularity.desc',page:p,'vote_count.gte':100}))?.results||[]; }
export async function fetchScifiMovies(p=1) { return (await tmdbFetch('/discover/movie',{with_genres:878,sort_by:'popularity.desc',page:p,'vote_count.gte':200}))?.results||[]; }
export async function fetchHorrorMovies(p=1) { return (await tmdbFetch('/discover/movie',{with_genres:27,sort_by:'popularity.desc',page:p,'vote_count.gte':100}))?.results||[]; }
export async function fetchComedyMovies(p=1) { return (await tmdbFetch('/discover/movie',{with_genres:35,sort_by:'popularity.desc',page:p,'vote_count.gte':200}))?.results||[]; }
export async function fetchAnimationMovies(p=1) { return (await tmdbFetch('/discover/movie',{with_genres:16,sort_by:'popularity.desc',page:p,'vote_count.gte':100}))?.results||[]; }
export async function fetchDramaMovies(p=1) { return (await tmdbFetch('/discover/movie',{with_genres:18,sort_by:'popularity.desc',page:p,'vote_count.gte':200}))?.results||[]; }
export async function fetchThrillerMovies(p=1) { return (await tmdbFetch('/discover/movie',{with_genres:53,sort_by:'popularity.desc',page:p,'vote_count.gte':200}))?.results||[]; }

// =============================
// SERIES FETCH — Each row has its own dedicated TV API call
// =============================
export async function fetchTrendingSeries(w='week') { return (await tmdbFetch(`/trending/tv/${w}`))?.results || []; }
export async function fetchPopularSeries(p=1) { return (await tmdbFetch('/tv/popular',{page:p}))?.results || []; }
export async function fetchTopRatedSeries(p=1) { return (await tmdbFetch('/tv/top_rated',{page:p}))?.results || []; }
export async function fetchOnAirSeries(p=1) { return (await tmdbFetch('/tv/on_the_air',{page:p}))?.results || []; }
export async function fetchActionSeries(p=1) { return (await tmdbFetch('/discover/tv',{with_genres:10759,sort_by:'popularity.desc',page:p,'vote_count.gte':50}))?.results||[]; }
export async function fetchDramaSeries(p=1) { return (await tmdbFetch('/discover/tv',{with_genres:18,sort_by:'popularity.desc',page:p,'vote_count.gte':50}))?.results||[]; }
export async function fetchComedySeries(p=1) { return (await tmdbFetch('/discover/tv',{with_genres:35,sort_by:'popularity.desc',page:p,'vote_count.gte':50}))?.results||[]; }
export async function fetchCrimeSeries(p=1) { return (await tmdbFetch('/discover/tv',{with_genres:80,sort_by:'popularity.desc',page:p,'vote_count.gte':50}))?.results||[]; }
export async function fetchScifiSeries(p=1) { return (await tmdbFetch('/discover/tv',{with_genres:10765,sort_by:'popularity.desc',page:p,'vote_count.gte':50}))?.results||[]; }
export async function fetchAnimeSeries(p=1) { return (await tmdbFetch('/discover/tv',{with_genres:16,sort_by:'popularity.desc',page:p,'vote_count.gte':50,with_original_language:'ja'}))?.results||[]; }
export async function fetchByGenreSeries(genreId,p=1) { return (await tmdbFetch('/discover/tv',{with_genres:genreId,sort_by:'popularity.desc',page:p,'vote_count.gte':50}))?.results||[]; }

// =============================
// DETAIL PAGE FETCHING
// =============================
export async function fetchMovieDetails(movieId) {
    let [details, credits, videos, similar] = await Promise.all([
        tmdbFetch(`/movie/${movieId}`, {append_to_response:'release_dates'}),
        tmdbFetch(`/movie/${movieId}/credits`),
        tmdbFetch(`/movie/${movieId}/videos`),
        tmdbFetch(`/movie/${movieId}/similar`)
    ]);
    
    return {
        details, credits: credits || { cast: [] },
        videos: videos?.results?.filter(v => v.type==='Trailer' && v.site==='YouTube') || [],
        similar: similar?.results?.slice(0,10) || []
    };
}

export async function fetchSeriesDetails(id) {
    let [details, credits, videos, similar] = await Promise.all([
        tmdbFetch(`/tv/${id}`),
        tmdbFetch(`/tv/${id}/credits`),
        tmdbFetch(`/tv/${id}/videos`),
        tmdbFetch(`/tv/${id}/similar`)
    ]);

    return {
        details, credits: credits || { cast: [] },
        videos: videos?.results?.filter(v => v.type==='Trailer' && v.site==='YouTube') || [],
        similar: similar?.results?.slice(0,10) || []
    };
}

export async function fetchMovieVideos(movieId) {
    const data = await tmdbFetch(`/movie/${movieId}/videos`);
    const vids = data?.results || [];
    const t = vids.find(v => v.type==='Trailer' && v.site==='YouTube') || vids.find(v => v.site==='YouTube');
    return t ? t.key : null;
}

export async function fetchSeriesVideos(id) {
    const data = await tmdbFetch(`/tv/${id}/videos`);
    const vids = data?.results || [];
    const t = vids.find(v => v.type==='Trailer' && v.site==='YouTube') || vids.find(v => v.site==='YouTube');
    return t ? t.key : null;
}

export async function searchMovies(query, page=1, filters={}) {
    if (!query || query.length < 2) return [];
    const params = {query, page};
    if (filters.year) params.year = filters.year;
    const data = await tmdbFetch('/search/movie', params);
    let results = data?.results || [];
    if (filters.genre) results = results.filter(m => m.genre_ids?.includes(parseInt(filters.genre)));
    if (filters.minRating) results = results.filter(m => m.vote_average >= parseFloat(filters.minRating));
    return results;
}

export async function discoverMovies(params={}) {
    const data = await tmdbFetch('/discover/movie', {sort_by:'popularity.desc','vote_count.gte':50,...params});
    return {results: data?.results||[], total_pages: data?.total_pages||1};
}

// =============================
// EMBED URLS (In-site player)
// =============================
export function getVidsrcEmbedUrl(id, type='movie') {
    return type==='tv' ? `https://vidsrc.xyz/embed/tv/${id}` : `https://vidsrc.xyz/embed/movie/${id}`;
}
export function get2EmbedUrl(id, type='movie') {
    return type==='tv' ? `https://www.2embed.cc/embedtvfull/${id}` : `https://www.2embed.cc/embed/${id}`;
}

// =============================
// GENRE MAPS
// =============================
export const GENRE_MAP = {
    28:'Action',12:'Adventure',16:'Animation',35:'Comedy',80:'Crime',
    99:'Documentary',18:'Drama',10751:'Family',14:'Fantasy',36:'History',
    27:'Horror',10402:'Music',9648:'Mystery',10749:'Romance',878:'Sci-Fi',
    10770:'TV Movie',53:'Thriller',10752:'War',37:'Western'
};

export const TV_GENRE_MAP = {
    10759:'Action & Adventure',16:'Animation',35:'Comedy',80:'Crime',
    99:'Documentary',18:'Drama',10751:'Family',10762:'Kids',9648:'Mystery',
    10765:'Sci-Fi & Fantasy',10767:'Talk',10768:'War & Politics',37:'Western'
};

export function getGenreNames(ids=[], isTv=false) {
    const map = isTv ? TV_GENRE_MAP : GENRE_MAP;
    return (ids||[]).slice(0,3).map(id => map[id]||'').filter(Boolean);
}

// =============================
// RECOMMENDATION ENGINE
// =============================
class RecommendationEngine {
    constructor() { this.userBehavior = this.loadBehavior(); }
    loadBehavior() {
        try { return JSON.parse(localStorage.getItem('cs_behavior')||'{"views":[],"watchlist":[],"genres":{}}'); }
        catch { return {views:[],watchlist:[],genres:{}}; }
    }
    saveBehavior() { localStorage.setItem('cs_behavior', JSON.stringify(this.userBehavior)); }
    trackView(movieId, genres=[]) {
        this.userBehavior.views = [movieId,...this.userBehavior.views.filter(id=>id!==movieId)].slice(0,50);
        genres.forEach(g => { this.userBehavior.genres[g]=(this.userBehavior.genres[g]||0)+1; });
        this.saveBehavior();
    }
    trackWatchlist(genres=[]) {
        genres.forEach(g => { this.userBehavior.genres[g]=(this.userBehavior.genres[g]||0)+2; });
        this.saveBehavior();
    }
    getTopGenres(n=3) {
        return Object.entries(this.userBehavior.genres).sort(([,a],[,b])=>b-a).slice(0,n).map(([id])=>parseInt(id));
    }
    async getPersonalizedRecommendations() {
        const user = JSON.parse(localStorage.getItem('cs_user')||'{}');
        const prefs = user.preferences||[];
        const top = this.getTopGenres(2);
        const all = [...new Set([...prefs,...top])];
        return all.length===0 ? fetchTrending() : fetchByGenre(all[0]);
    }
}
export const recommendationEngine = new RecommendationEngine();
