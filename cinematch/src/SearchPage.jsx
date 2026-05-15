import { useState } from 'react';
import MovieCard from './MovieCard';

// Get a free API key at https://www.themoviedb.org/settings/api
// For Vite projects: add VITE_TMDB_API_KEY=your_key to your .env file
// For Create React App: add REACT_APP_TMDB_API_KEY=your_key to your .env file
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const FALLBACK_MOVIES = [
  {
    id: 27205,
    title: 'Inception',
    release_date: '2010-07-16',
    vote_average: 8.4,
    genre_ids: [28, 878],
    poster_path: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
  },
  {
    id: 157336,
    title: 'Interstellar',
    release_date: '2014-11-07',
    vote_average: 8.5,
    genre_ids: [12, 18, 878],
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  },
  {
    id: 603,
    title: 'The Matrix',
    release_date: '1999-03-31',
    vote_average: 8.2,
    genre_ids: [28, 878],
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
  },
];

function getFallbackMovies(searchTerm) {
  const normalizedSearch = searchTerm.toLowerCase();

  return FALLBACK_MOVIES.filter((movie) =>
    movie.title.toLowerCase().includes(normalizedSearch)
  );
}

function SearchPage() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  async function searchMovies(searchTerm) {
    if (!searchTerm.trim()) {
      setMovies([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    if (!API_KEY) {
      setMovies(getFallbackMovies(searchTerm));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      const searchResults = data.results || [];
      setMovies(searchResults.length > 0 ? searchResults : getFallbackMovies(searchTerm));
    } catch (err) {
      console.error('Search failed:', err);
      setMovies(getFallbackMovies(searchTerm));
    }

    setLoading(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    searchMovies(query);
  }

  function clearSearch() {
    setQuery('');
    setMovies([]);
    setHasSearched(false);
  }

  return (
    <div style={{
      backgroundColor: '#0F0F0F',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* ── Main content ── */}
      <main style={{ padding: '112px 48px 48px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Landing state: big search form before the user has searched */}
        {!hasSearched && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h1 style={{
              color: '#F5C518',
              fontSize: '48px',
              fontWeight: '800',
              marginBottom: '16px',
            }}>
              Find your next movie
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', marginBottom: '40px' }}>
              Search from thousands of movies
            </p>
            <form onSubmit={handleSubmit} style={{
              display: 'flex', gap: '12px',
              justifyContent: 'center', maxWidth: '500px', margin: '0 auto',
            }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Inception, The Matrix..."
                style={{
                  flex: 1, padding: '14px 20px', borderRadius: '9999px',
                  backgroundColor: 'rgba(26,26,26,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white', fontSize: '16px', outline: 'none',
                }}
              />
              <button type="submit" style={{
                padding: '14px 28px', borderRadius: '9999px',
                backgroundColor: '#e50914', color: 'white',
                border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '16px',
              }}>
                Search
              </button>
            </form>
          </div>
        )}

        {/* Results header */}
        {hasSearched && (
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              color: '#F5C518',
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '8px',
            }}>
              Results for &ldquo;{query}&rdquo;
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px' }}>
              {loading ? 'Searching...' : `Found ${movies.length} match${movies.length !== 1 ? 'es' : ''}`}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>
            Loading...
          </div>
        )}

        {/* Movie grid */}
        {!loading && movies.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '16px',
          }}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && hasSearched && movies.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            backgroundColor: 'rgba(26,26,26,0.4)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', maxWidth: '600px', margin: '0 auto',
          }}>
            <div style={{ fontSize: '64px', marginBottom: '24px', opacity: 0.3 }}>🎬</div>
            <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>No movies found</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', marginBottom: '32px' }}>
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try a different search term.
            </p>
            <button
              onClick={clearSearch}
              style={{
                padding: '12px 24px', borderRadius: '9999px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
              }}
            >
              Clear Search
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default SearchPage;
