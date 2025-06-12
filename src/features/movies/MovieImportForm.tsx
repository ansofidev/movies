import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { createMovie, fetchMovies } from './moviesSlice';
import type { Movie } from '../types';
import CustomFileInput from '../../components/CustomFileInput/CustomFileInput';
import './MovieImportForm.scss';

const parseMoviesFile = (text: string): Movie[] => {
  const blocks = text.trim().split(/\n\s*\n/);
  const allowedFormats: Movie['format'][] = ['VHS', 'DVD', 'Blu-ray'];

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

      const format = allowedFormats.includes(formatStr as Movie['format'])
        ? (formatStr as Movie['format'])
        : 'DVD';

      const actors = starsLine.split(',').map((s) => s.trim());

      return { title, year, format, actors };
    })
    .filter((m): m is Movie => m !== null);
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
      } else if (createMovie.rejected.match(action)) {
        skippedCount++;
        console.warn('Skipped (probably duplicate):', movie.title);
      }
    }

    await dispatch(fetchMovies());
    console.log(`Імпорт завершено. Нових: ${createdCount}, Пропущено: ${skippedCount}`);
  };

  return (
    <div className="movie-import-form">
      <h3>Import Movies from .txt</h3>
      <CustomFileInput accept=".txt" onFileSelect={handleFileSelect} />
    </div>
  );
}
