import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetails } from '../features/movies/moviesSlice';
import type { RootState, AppDispatch } from '../app/store';
import '../styles/MoviePage.scss';

const MoviePage = () => {
  const { id } = useParams<Record<string, string | undefined>>();
  const movieId = id ? parseInt(id, 10) : null;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const movie = useSelector((state: RootState) =>
    state.movies.movies.find(m => m.id === movieId)
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovieDetails = async () => {
      if (!movieId) return;

      if (!movie || !movie.actors || movie.actors.length === 0) {
        setLoading(true);
        setError(null);
        try {
          await dispatch(fetchMovieDetails(movieId)).unwrap();
        } catch (err) {
          if (typeof err === 'string') {
            setError(err);
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Failed to load movie details');
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [dispatch, movieId, movie]);

  if (loading) return <p>Loading movie data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movie) return <p>Movie not found.</p>;

  const actorsList = Array.isArray(movie.actors)
    ? movie.actors.map(actor =>
        typeof actor === 'string' ? actor : actor.name
      )
    : [];

  return (
    <div className="movie-page-container">
      <h2>{movie.title}</h2>
      <p><strong>Year:</strong> {movie.year}</p>
      <p><strong>Format:</strong> {movie.format}</p>
      <p><strong>Actors:</strong></p>
      {actorsList.length > 0 ? (
        <ul>
          {actorsList.map((actor, i) => (
            <li key={i}>{actor}</li>
          ))}
        </ul>
      ) : (
        <p>No actors info available.</p>
      )}
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>
    </div>
  );
};

export default MoviePage;
