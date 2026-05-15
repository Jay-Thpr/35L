import './HeroBanner.css';

function HeroBanner({ movie }) {
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  return (
    <section className="hero-banner">
      {backdropUrl && (
        <img
          className="hero-banner__backdrop"
          src={backdropUrl}
          alt=""
          aria-hidden="true"
        />
      )}
      <div className="hero-banner__gradient" />
      <div className="hero-banner__content">
        <h1 className="hero-banner__title">{movie.title}</h1>
        <p className="hero-banner__overview">{movie.overview}</p>
        <div className="hero-banner__actions">
          <button className="hero-banner__btn hero-banner__btn--primary">
            <span>&#9654;</span> Play
          </button>
          <button className="hero-banner__btn hero-banner__btn--secondary">
            <span>&#9432;</span> More Info
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;
