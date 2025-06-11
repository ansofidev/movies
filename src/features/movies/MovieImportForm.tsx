import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import { createMovie } from './moviesSlice';
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
        lines.find((line) => line.startsWith(`${key}:`))?.split(': ')[1]?.trim();

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

    console.log('Parsed movies:', movies); // для дебага

    for (const movie of movies) {
      try {
        await dispatch(createMovie(movie));
      } catch (err) {
        console.error('Error uploading movie:', movie, err);
      }
    }
  };

  return (
    <div className="movie-import-form">
      <h3>Import Movies from .txt</h3>
      <CustomFileInput accept=".txt" onFileSelect={handleFileSelect} />
    </div>
  );
}
