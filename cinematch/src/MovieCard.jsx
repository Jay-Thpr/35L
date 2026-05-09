import { useState } from 'react';
import ReviewModal from './ReviewModal';

const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy',
  80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family',
  14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music',
  9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi', 53: 'Thriller',
  10752: 'War', 37: 'Western'
};

function MovieCard({ movie }) {
  const [hovered, setHovered] = useState(false);
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
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          aspectRatio: '2 / 3',
          backgroundColor: '#2a1614',
          cursor: 'pointer',
          transform: hovered ? 'scale(1.03)' : 'scale(1)',
          transition: 'transform 0.3s',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}
      >
        {/* Poster */}
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.3)', fontSize: '14px',
          }}>
            No Image
          </div>
        )}

        {/* Dark gradient so text is readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, black 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
          opacity: 0.85,
        }} />

        {/* Rating badge */}
        <div style={{
          position: 'absolute', top: '12px', left: '12px',
          backgroundColor: '#F5C518', color: 'black',
          padding: '3px 8px', borderRadius: '9999px',
          fontSize: '12px', fontWeight: '700',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}>
          <span>TMDB {rating}</span>
        </div>

        {movieReview && (
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: 'rgba(229,9,20,0.92)',
            color: 'white',
            padding: '3px 8px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '700',
          }}>
            Your rating {movieReview.rating}/5
          </div>
        )}

        {/* Info at bottom */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, width: '100%',
          padding: '16px',
          transform: hovered ? 'translateY(0)' : 'translateY(16px)',
          transition: 'transform 0.3s',
          boxSizing: 'border-box',
        }}>
          <h3 style={{
            color: 'white', fontWeight: '600', fontSize: '16px',
            margin: '0 0 6px 0',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {movie.title}
          </h3>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '12px',
          }}>
            <span>{year}</span>
            {genre && (
              <>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.4)', display: 'inline-block' }} />
                <span>{genre}</span>
              </>
            )}
          </div>
          <button
            onClick={() => setReviewOpen(true)}
            style={{
              width: '100%',
              backgroundColor: '#e50914',
              color: 'white',
              fontSize: '13px', fontWeight: '600',
              padding: '8px', borderRadius: '8px',
              border: 'none', cursor: 'pointer',
              opacity: hovered ? 1 : 0.92,
              transition: 'opacity 0.3s',
              boxShadow: '0 0 15px rgba(229,9,20,0.4)',
            }}
          >
            {movieReview ? 'Edit Review' : 'Write Review'}
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
