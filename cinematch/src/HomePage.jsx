import { useState } from 'react';
import HeroBanner from './HeroBanner';
import MovieRow from './MovieRow';
import { FEATURED_MOVIE, MOVIE_ROWS } from './dummyData';
import './HomePage.css';

function HomePage() {
  // Later: replace dummy data with useEffect + fetch("/api/...")
  const [featured] = useState(FEATURED_MOVIE);
  const [rows] = useState(MOVIE_ROWS);

  return (
    <div className="home-page">
      <HeroBanner movie={featured} />
      <div className="home-page__rows">
        {rows.map((row) => (
          <MovieRow key={row.title} title={row.title} movies={row.movies} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
