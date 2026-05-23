import { useRef, useState } from 'react';
import MovieCard from './MovieCard';
import './MovieRow.css';

function MovieRow({ title, movies }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateScrollButtons() {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }

  function scroll(direction) {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  }

  return (
    <div className="movie-row">
      <h2 className="movie-row__title">{title}</h2>
      <div className="movie-row__slider">
        {canScrollLeft && (
          <button
            className="movie-row__arrow movie-row__arrow--left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            &#8249;
          </button>
        )}
        <div
          className="movie-row__cards"
          ref={scrollRef}
          onScroll={updateScrollButtons}
        >
          {movies.map((movie) => (
            <div className="movie-row__card-wrapper" key={movie.id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
        {canScrollRight && (
          <button
            className="movie-row__arrow movie-row__arrow--right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            &#8250;
          </button>
        )}
      </div>
    </div>
  );
}

export default MovieRow;
