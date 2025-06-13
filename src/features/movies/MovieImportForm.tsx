import { useDispatch } from 'react-redux';
import { store, type AppDispatch } from '../../app/store';
import {
  createMovie,
  fetchMissingMovieDetails,
  fetchMovieDetails,
} from './moviesSlice';
import type { Movie, Actor, MovieFormat } from '../types';
import CustomFileInput from '../../components/CustomFileInput/CustomFileInput';
import './MovieImportForm.scss';

function isMovie(m: Movie | null): m is Movie {
  return m !== null;
}

const allowedFormats: MovieFormat[] = ['VHS', 'DVD', 'Blu-ray'];

const parseMoviesFile = (text: string): Movie[] => {
  const blocks = text.trim().split(/\n\s*\n/);

  return blocks
    .map((block) => {
      const lines = block.trim().split('\n');

      const getLineValue = (key: string) =>
        lines.find((line) => line.startsWith(`${key}:`))
          ?.replace(`${key}:`, '')
          .trim();

      const title = getLineValue('Title');
      const yearStr = getLineValue('Release Year');
      const formatStr = getLineValue('Format');
      const starsLine = getLineValue('Stars');

      if (!title || !yearStr || !formatStr || !starsLine) return null;

      const year = Number(yearStr);
      if (isNaN(year)) return null;

      const format = allowedFormats.includes(formatStr as MovieFormat)
        ? (formatStr as MovieFormat)
        : 'DVD';

      const actors: (string | Actor)[] = starsLine
        .split(',')
        .map((s) => s.trim());

      return { title, year, format, actors };
    })
    .filter(isMovie);
};

export default function MovieImportForm() {
  const dispatch = useDispatch<AppDispatch>();

  const handleFileSelect = async (file: File) => {
    const text = await file.text();
    const movies = parseMoviesFile(text);

    let createdCount = 0;
    let skippedCount = 0;

    for (const movie of movies) {
      const action = await dispatch(createMovie(movie));

      if (createMovie.fulfilled.match(action)) {
        createdCount++;
        const createdMovie = action.payload;
        if (createdMovie?.id) {
          await dispatch(fetchMovieDetails(createdMovie.id));
        }
      } else if (createMovie.rejected.match(action)) {
        skippedCount++;
      }
    }

    await dispatch(fetchMissingMovieDetails(store.getState().movies.movies));

    console.log(`Created: ${createdCount}, Skipped: ${skippedCount}`);
  };

  return (
    <div className="movie-import-form">
      <h3>Import Movies from .txt</h3>
      <CustomFileInput accept=".txt" onFileSelect={handleFileSelect} />
    </div>
  );
}
