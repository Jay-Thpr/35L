import { useState } from 'react';
import MovieCard from './MovieCard';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

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

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();
      setMovies(data.results || []);
    } catch (err) {
      console.error('Search failed:', err);
      setMovies([]);
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

      {/* ── Navbar ── */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 32px',
        height: '80px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ fontSize: '22px', fontWeight: '900', color: '#e50914', letterSpacing: '-1px' }}>
            CINEMATIC
          </div>
          <nav style={{ display: 'flex', gap: '24px' }}>
            <a href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: '500' }}>Home</a>
            <a href="/search" style={{
              color: 'white', textDecoration: 'none', fontWeight: '500',
              borderBottom: '2px solid #e50914', paddingBottom: '4px',
            }}>Discovery</a>
            <a href="/feed" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: '500' }}>Feed</a>
          </nav>
        </div>

        {/* Search bar in navbar */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: 'rgba(26,26,26,0.4)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '9999px',
          padding: '8px 16px',
          width: '280px',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: 'white', flex: 1, fontSize: '15px',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '16px',
              }}
            >
              ✕
            </button>
          )}
        </form>
      </header>

      {/* ── Main content ── */}
      <main style={{ padding: '48px 32px', maxWidth: '1400px', margin: '0 auto' }}>

        {/* Landing state: big search form before the user has searched */}
        {!hasSearched && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>
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
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>
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
