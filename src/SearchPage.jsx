import { useState } from 'react';
import MovieCard from './MovieCard';
import './SearchPage.css';

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
    <div className="search-page">
      <main className="search-page__main">
        {!hasSearched && (
          <div className="search-page__landing">
            <h1 className="search-page__heading">Find your next film</h1>
            <p className="search-page__subheading">Search from thousands of movies</p>
            <form className="search-page__form" onSubmit={handleSubmit}>
              <input
                className="search-page__input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Inception, The Matrix..."
              />
              <button className="search-page__submit" type="submit">
                Search
              </button>
            </form>
          </div>
        )}

        {hasSearched && (
          <div className="search-page__results-header">
            <h1 className="search-page__results-title">
              Results for &ldquo;{query}&rdquo;
            </h1>
            <p className="search-page__results-count">
              {loading ? 'Searching...' : `Found ${movies.length} match${movies.length !== 1 ? 'es' : ''}`}
            </p>
          </div>
        )}

        {loading && (
          <div className="search-page__loading">Searching...</div>
        )}

        {!loading && movies.length > 0 && (
          <div className="search-page__grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}

        {!loading && hasSearched && movies.length === 0 && (
          <div className="search-page__empty">
            <div className="search-page__empty-icon">🎬</div>
            <h2>No movies found</h2>
            <p>
              We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try a different search.
            </p>
            <button className="search-page__clear-btn" onClick={clearSearch}>
              Clear Search
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchPage;
