import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovies, deleteMovie } from '../../features/movies/moviesSlice';
import type { RootState, AppDispatch } from '../../app/store';
import AddMovieModal from '../AddMovieModal/AddMovieModal';
import './MovieList.scss';

export default function MovieList() {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loading, error } = useSelector((state: RootState) => state.movies);
  const [showModal, setShowModal] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleDelete = (id?: number) => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this movie?')) {
      dispatch(deleteMovie(id));
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const sortedMovies = [...movies].sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    return sortOrder === 'asc' ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
  });

  return (
    <div className="movie-list-container">
      <div className="movie-list-header">
        <h2>Movies</h2>
        <div className="movie-controls">
          <button onClick={toggleSortOrder} className="sort-button" title="Toggle sort order">
            {sortOrder === 'asc' ? '🔼 A → Z' : '🔽 Z → A'}
          </button>
          <button onClick={() => setShowModal(true)} className="add-button">
            ➕ Add Movie
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <ul>
        {sortedMovies.length > 0 ? (
          sortedMovies.map((m) => (
            <li key={m.id ?? `${m.title}-${m.year}`}>
              <Link to={`/movies/${m.id}`}>
                {m.title} ({m.year})
              </Link>
              <button
                onClick={() => handleDelete(m.id)}
                className="delete-button"
                title="Delete movie"
              >
                🗑️
              </button>
            </li>
          ))
        ) : (
          <li>No valid movies data</li>
        )}
      </ul>

      {showModal && <AddMovieModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
