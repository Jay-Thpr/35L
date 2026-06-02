import { useState, useEffect } from 'react';
import HeroBanner from './HeroBanner';
import MovieRow from './MovieRow';
import { FEATURED_MOVIE } from './dummyData';
import { fetchRecommendations } from './recommendationsApi';
import './HomePage.css';

function HomePage({ userId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    fetchRecommendations(userId).then((movies) => {
      setRecommendations(movies);
      setLoading(false);
    });
  }, [userId]);

  return (
    <div className="home-page">
      <HeroBanner movie={FEATURED_MOVIE} />
      <div className="home-page__rows">
        {loading ? (
          <p className="home-page__status">Loading recommendations…</p>
        ) : recommendations.length > 0 ? (
          <MovieRow title="Recommended for You" movies={recommendations} userId={userId} />
        ) : (
          <p className="home-page__status">Rate some movies to get personalized recommendations.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
