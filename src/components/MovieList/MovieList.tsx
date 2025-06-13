import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovies } from '../../features/movies/moviesSlice';
import type { RootState, AppDispatch } from '../../app/store';
import AddMovieForm from '../../features/movies/AddMovieForm/AddMovieForm';
import './MovieList.scss';

export default function MovieList() {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loading, error } = useSelector((state: RootState) => state.movies);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  return (
    <div className="movie-list-container">
      <div className="movie-list-header">
        <h2>Movies</h2>
        <button onClick={() => setShowModal(true)} className="add-button">
          ➕ Add Movie
        </button>
      </div>

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

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowModal(false)}>✖</button>
            <AddMovieForm />
          </div>
        </div>
      )}
    </div>
  );
}
