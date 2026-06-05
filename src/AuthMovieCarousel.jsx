const carouselMovies = [
  { title: 'Inception', poster: '/auth-posters/inception.jpg' },
  { title: 'Interstellar', poster: '/auth-posters/interstellar.jpg' },
  { title: 'The Matrix', poster: '/auth-posters/the-matrix.jpg' },
  { title: 'Pulp Fiction', poster: '/auth-posters/pulp-fiction.jpg' },
  { title: 'Fight Club', poster: '/auth-posters/fight-club.jpg' },
  { title: 'Forrest Gump', poster: '/auth-posters/forrest-gump.jpg' },
  { title: 'The Godfather', poster: '/auth-posters/the-godfather.jpg' },
  { title: 'Spirited Away', poster: '/auth-posters/spirited-away.jpg' },
  { title: 'Your Name.', poster: '/auth-posters/your-name.jpg' },
  { title: 'Parasite', poster: '/auth-posters/parasite.jpg' },
  { title: 'Avengers: Endgame', poster: '/auth-posters/avengers-endgame.jpg' },
];

function AuthMovieCarousel() {
  const posters = [...carouselMovies, ...carouselMovies];

  return (
    <div className="auth-carousel" aria-label="Featured movie posters">
      <div className="auth-carousel__track">
        {posters.map((movie, index) => (
          <img
            key={`${movie.title}-${index}`}
            className="auth-carousel__poster"
            src={movie.poster}
            alt={movie.title}
          />
        ))}
      </div>
    </div>
  );
}

export default AuthMovieCarousel;
