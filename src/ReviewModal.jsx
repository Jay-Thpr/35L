import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { postRatingToBackend } from './recommendationsApi';
import './ReviewModal.css';

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

function ReviewModal({ movie, onClose, onReviewChange, userId, existingRating }) {
  const [rating, setRating] = useState(existingRating || 0);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState(movie.overview || '');

  useEffect(() => {
    if (overview || !TMDB_KEY || !movie.id) return;
    fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_KEY}`)
      .then((r) => r.json())
      .then((data) => setOverview(data.overview || ''))
      .catch(() => {});
  }, [movie.id]);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';

  async function handleSave(event) {
    event.preventDefault();
    setError('');

    if (!rating) {
      setError('Choose a rating before saving.');
      return;
    }

    if (isSupabaseConfigured && userId) {
      const { error: dbError } = await supabase
        .from('ratings')
        .upsert(
          { user_id: userId, movie_id: movie.id, rating },
          { onConflict: 'user_id,movie_id' }
        );
      if (dbError) {
        setError(dbError.message);
        return;
      }
      postRatingToBackend(userId, movie.id, rating);
    }

    onReviewChange({ rating });
    onClose();
  }

  async function handleDelete() {
    if (isSupabaseConfigured && userId) {
      await supabase
        .from('ratings')
        .delete()
        .eq('user_id', userId)
        .eq('movie_id', movie.id);
    }
    onReviewChange(null);
    onClose();
  }

  return (
    <div className="review-modal__overlay" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
      <form className="review-modal" onSubmit={handleSave}>
        <div className="review-modal__header">
          <div>
            <p className="review-modal__eyebrow">Movie review</p>
            <h2 id="review-modal-title">{movie.title}</h2>
          </div>
          <button className="review-modal__icon-button" type="button" onClick={onClose} aria-label="Close review modal">
            x
          </button>
        </div>

        <div className="review-modal__body">
          <div className="review-modal__poster">
            {posterUrl ? (
              <img src={posterUrl} alt={movie.title} />
            ) : (
              <span>No Image</span>
            )}
          </div>

          <div className="review-modal__content">
            <p className="review-modal__meta">{year}</p>
            {overview && <p className="review-modal__overview">{overview}</p>}
            <label className="review-modal__field">
              <span>Your rating</span>
              <div className="review-modal__rating" aria-label="Choose a rating">
                {[1, 2, 3, 4, 5].map((ratingValue) => (
                  <button
                    className={rating >= ratingValue ? 'review-modal__rating-button is-active' : 'review-modal__rating-button'}
                    key={ratingValue}
                    type="button"
                    onClick={() => setRating(ratingValue)}
                    aria-label={`${ratingValue} out of 5`}
                  >
                    {ratingValue}
                  </button>
                ))}
              </div>
            </label>

            {error && <p className="review-modal__error">{error}</p>}
          </div>
        </div>

        <div className="review-modal__actions">
          {existingRating && (
            <button className="review-modal__delete" type="button" onClick={handleDelete}>
              Delete review
            </button>
          )}
          <button className="review-modal__secondary" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="review-modal__primary" type="submit">
            Save review
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewModal;
