import { useState } from 'react';
import './ReviewModal.css';

const REVIEWS_STORAGE_KEY = 'cinematch.movieReviews';

function ReviewModal({ movie, onClose, onReviewChange }) {
  const existingReview = getSavedReview(movie.id);
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(existingReview?.reviewText || '');
  const [error, setError] = useState('');

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';

  function handleSave(event) {
    event.preventDefault();
    setError('');

    if (!rating) {
      setError('Choose a rating before saving.');
      return;
    }

    const reviews = getSavedReviews();
    const savedReview = {
      movieId: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      releaseDate: movie.release_date,
      rating,
      reviewText: reviewText.trim(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      REVIEWS_STORAGE_KEY,
      JSON.stringify({ ...reviews, [movie.id]: savedReview })
    );

    onReviewChange(savedReview);
    onClose();
  }

  function handleDelete() {
    const reviews = getSavedReviews();
    delete reviews[movie.id];
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
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

            <label className="review-modal__field">
              <span>Your review</span>
              <textarea
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                placeholder="Write what you thought about this movie..."
                rows="6"
              />
            </label>

            {error && <p className="review-modal__error">{error}</p>}
          </div>
        </div>

        <div className="review-modal__actions">
          {existingReview && (
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

function getSavedReview(movieId) {
  return getSavedReviews()[movieId] || null;
}

function getSavedReviews() {
  const savedReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);

  if (!savedReviews) {
    return {};
  }

  try {
    return JSON.parse(savedReviews);
  } catch {
    localStorage.removeItem(REVIEWS_STORAGE_KEY);
    return {};
  }
}

export default ReviewModal;
