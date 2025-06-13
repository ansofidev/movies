import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import type { Movie, Actor } from '../features/types';
import '../styles/MoviePage.scss';

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        const response = await axios.get(`/movies/${id}`);
        setMovie(response.data.data);
      } catch {
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <p>Loading movie data...</p>;
  if (!movie) return <p>Movie not found.</p>;

  const actorsList = Array.isArray(movie.actors)
    ? movie.actors.map(actor =>
        typeof actor === 'string' ? actor : (actor as Actor).name
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