import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../app/store';
import type { MovieFormat } from '../../types';
import { createMovie, fetchMovies } from '../moviesSlice';
import { toast } from 'react-toastify';
import './AddMovieForm.scss';

interface AddMovieFormProps {
  onClose: () => void;
}

export default function AddMovieForm({ onClose }: AddMovieFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [format, setFormat] = useState<MovieFormat>('DVD');
  const [actors, setActors] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateFields = (): boolean => {
    if (!title.trim()) {
      setErrorMessage('Please enter a valid movie title.');
      return false;
    }

    const numericYear = Number(year);
    if (!year || isNaN(numericYear) || numericYear < 1900 || numericYear > 2021) {
      setErrorMessage('Please enter a valid release year (1900–2021).');
      return false;
    }

    if (!actors.trim()) {
      setErrorMessage('Please add at least one actor (comma-separated).');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) return;

    const movie = {
      title: title.trim(),
      year: Number(year),
      format,
      actors: actors
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean),
    };

    const result = await dispatch(createMovie(movie));

    if (createMovie.fulfilled.match(result)) {
      toast.success('🎉 Movie added successfully!');
      setTitle('');
      setYear('');
      setFormat('DVD');
      setActors('');
      setErrorMessage('');
      dispatch(fetchMovies());
      onClose();
    } else {
      const errorText =
        typeof result.payload === 'string'
          ? result.payload
          : 'An unexpected error occurred while adding the movie.';
      setErrorMessage(errorText);
      toast.error(`❌ ${errorText}`);
    }
  };

  return (
    <div className="add-movie-form">
      <h3>Add New Movie</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Release Year (e.g. 1999)"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <select value={format} onChange={(e) => setFormat(e.target.value as MovieFormat)}>
          <option value="VHS">VHS</option>
          <option value="DVD">DVD</option>
          <option value="Blu-ray">Blu-ray</option>
        </select>

        <input
          type="text"
          placeholder="Actors (comma-separated)"
          value={actors}
          onChange={(e) => setActors(e.target.value)}
        />

        <button type="submit">Add Movie</button>
      </form>

      {errorMessage && <p className="form-error">{errorMessage}</p>}
    </div>
  );
}
