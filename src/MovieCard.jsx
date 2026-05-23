import { useState } from 'react';
import ReviewModal from './ReviewModal';
import './MovieCard.css';

const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
  10752: 'War', 37: 'Western'
};

function MovieCard({ movie }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [movieReview, setMovieReview] = useState(() => getSavedReview(movie.id));

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
  const genre = movie.genre_ids?.[0] ? GENRE_MAP[movie.genre_ids[0]] : '';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  return (
    <>
      <div className="movie-card">
        {posterUrl ? (
          <img className="movie-card__poster" src={posterUrl} alt={movie.title} />
        ) : (
          <div className="movie-card__no-image">No Image</div>
        )}

        <div className="movie-card__gradient" />

        <div className="movie-card__rating-badge">
          {rating}
        </div>

        {movieReview && (
          <div className="movie-card__user-badge">
            {movieReview.rating}/5
          </div>
        )}

        <div className="movie-card__info">
          <h3 className="movie-card__title">{movie.title}</h3>
          <div className="movie-card__meta">
            <span>{year}</span>
            {genre && (
              <>
                <span className="movie-card__meta-dot" />
                <span>{genre}</span>
              </>
            )}
          </div>
          <button
            className="movie-card__review-btn"
            onClick={() => setReviewOpen(true)}
          >
            {movieReview ? 'Edit Review' : 'Review'}
          </button>
        </div>
      </div>

      {reviewOpen && (
        <ReviewModal
          movie={movie}
          onClose={() => setReviewOpen(false)}
          onReviewChange={setMovieReview}
        />
      )}
    </>
  );
}

function getSavedReview(movieId) {
  const savedReviews = localStorage.getItem('cinematch.movieReviews');

  if (!savedReviews) {
    return null;
  }

  try {
    const reviews = JSON.parse(savedReviews);
    return reviews[movieId] || null;
  } catch {
    localStorage.removeItem('cinematch.movieReviews');
    return null;
  }
}

export default MovieCard;
