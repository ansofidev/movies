import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchMovies } from '../features/movies/moviesSlice';
import { selectAuth } from '../features/auth/authSlice';

import MovieList from '../components/MovieList/MovieList';
import MovieImportForm from '../features/movies/MovieImportForm';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector(selectAuth);

  useEffect(() => {
    if (token) {
      dispatch(fetchMovies());
    }
  }, [dispatch, token]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Movie Library</h1>
      <MovieImportForm />
      <MovieList />
    </div>
  );
}
