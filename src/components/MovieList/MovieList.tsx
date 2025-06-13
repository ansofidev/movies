import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMovies,
  deleteMovie,
  fetchMissingMovieDetails,
} from '../../features/movies/moviesSlice';
import type { RootState, AppDispatch } from '../../app/store';
import AddMovieModal from '../AddMovieModal/AddMovieModal';
import SearchBar from '../SearchBar/SearchBar';
import './MovieList.scss';

export default function MovieList() {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loading, error } = useSelector(
    (state: RootState) => state.movies
  );

  const [showModal, setShowModal] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'title' | 'actor'>('title');

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  useEffect(() => {
    if (movies.length) {
      dispatch(fetchMissingMovieDetails(movies));
    }
  }, [movies, dispatch]);

  const handleDelete = (id?: number) => {
    if (!id) return;
    if (confirm('Are you sure you want to delete this movie?')) {
      dispatch(deleteMovie(id));
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleSearch = (query: string, mode: 'title' | 'actor') => {
    setSearchQuery(query);
    setSearchMode(mode);
  };

  const filteredMovies = movies.filter((movie) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    if (searchMode === 'title') {
      return movie.title.toLowerCase().includes(query);
    }

    if (searchMode === 'actor') {
      if (!movie.actors || movie.actors.length === 0) return false;

      const actorNames = movie.actors.map((actor) => {
        if (typeof actor === 'string') return actor;
        if ('name' in actor && typeof actor.name === 'string') return actor.name;
        return '';
      });

      return actorNames.some((name) => name.toLowerCase().includes(query));
    }

    return true;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    return sortOrder === 'asc'
      ? aTitle.localeCompare(bTitle)
      : bTitle.localeCompare(aTitle);
  });

  return (
    <div className="movie-list-container">
      <div className="movie-list-header">
        <h2>Movies</h2>
        <div className="movie-controls">
          <button
            onClick={toggleSortOrder}
            className="sort-button"
            title="Toggle sort order"
          >
            {sortOrder === 'asc' ? '🔼 A → Z' : '🔽 Z → A'}
          </button>
          <button onClick={() => setShowModal(true)} className="add-button">
            ➕ Add Movie
          </button>
        </div>
      </div>

      <SearchBar onSearch={handleSearch} />

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <ul>
        {sortedMovies.length > 0 ? (
          sortedMovies.map((movie) => (
            <li key={movie.id ?? `${movie.title}-${movie.year}`}>
              <Link to={`/movies/${movie.id}`}>
                {movie.title} ({movie.year})
              </Link>
              <button
                onClick={() => handleDelete(movie.id)}
                className="delete-button"
                title="Delete movie"
              >
                🗑️
              </button>
            </li>
          ))
        ) : (
          <li>No movies found</li>
        )}
      </ul>

      {showModal && <AddMovieModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
