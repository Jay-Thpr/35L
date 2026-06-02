const API_URL = import.meta.env.VITE_API_URL;
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;

export async function fetchRecommendations(userId, limit = 10) {
  if (!API_URL || !userId) {
    return [];
  }
  
  let movies;
  try {
    const res = await fetch(`${API_URL}/recommendations?user_id=${userId}&limit=${limit}`);
    if (!res.ok) return [];
    movies = await res.json();
  } catch {
    return [];
  }

  if (!TMDB_KEY) return movies;

  const enriched = await Promise.allSettled(
    movies.map((m) =>
      fetch(`https://api.themoviedb.org/3/movie/${m.id}?api_key=${TMDB_KEY}`)
        .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    )
  );

  return movies.map((m, i) => {
    const tmdb = enriched[i].status === 'fulfilled' ? enriched[i].value : null;
    return {
      id: m.id,
      title: m.title,
      poster_path: tmdb?.poster_path ?? null,
      vote_average: tmdb?.vote_average,
      release_date: tmdb?.release_date || String(m.release_year),
      genre_ids: tmdb?.genres?.map((g) => g.id) ?? [],
    };
  });
}

export function postRatingToBackend(userId, movieId, rating) {
  if (!API_URL || !userId) return;
  fetch(`${API_URL}/ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, movie_id: movieId, rating }),
  }).catch(() => console.warn('Failed to post rating to backend'));
}
