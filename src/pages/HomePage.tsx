import MovieList from '../components/MovieList/MovieList';
import MovieImportForm from '../features/movies/MovieImportForm';

export default function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Movie Library</h1>
      <MovieImportForm />
      <MovieList />
    </div>
  );
}
