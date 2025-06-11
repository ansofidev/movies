import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovies } from '../../features/movies/moviesSlice';
import type { RootState, AppDispatch } from '../../app/store';
import './MovieList.scss';

export default function MovieList() {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loading, error } = useSelector((state: RootState) => state.movies);
  console.log('🎬 movies:', movies);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  return (
    <div className="movie-list-container">
      <h2>Movies</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {Array.isArray(movies) && movies.length > 0 ? (
          movies
            .filter((m) => m.title && m.year)
            .map((m) => (
              <li key={m.id ?? `${m.title}-${m.year}`}>
                {m.title} ({m.year})
              </li>
            ))
        ) : (
          <li>No valid movies data</li>
        )}
      </ul>
    </div>
  );
}
