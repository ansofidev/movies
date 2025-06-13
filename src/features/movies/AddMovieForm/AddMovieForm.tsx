import { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../app/store';
import { createMovie, fetchMovies } from '../moviesSlice';
import './AddMovieForm.scss';

export default function AddMovieForm() {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [format, setFormat] = useState('DVD');
  const [actors, setActors] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !year || !format || !actors) {
      setMessage('❗ Please fill in all fields');
      return;
    }

    const movie = {
      title: title.trim(),
      year: Number(year),
      format: format as 'VHS' | 'DVD' | 'Blu-ray',
      actors: actors.split(',').map((a) => a.trim()),
    };

    const result = await dispatch(createMovie(movie));

    if (createMovie.fulfilled.match(result)) {
      setMessage('✅ Movie added successfully');
      setTitle('');
      setYear('');
      setFormat('DVD');
      setActors('');
      dispatch(fetchMovies());
    } else {
      setMessage(`⚠️ Failed to add movie: ${result.payload}`);
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
          placeholder="Release Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <select value={format} onChange={(e) => setFormat(e.target.value)}>
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

      {message && <p className="message">{message}</p>}
    </div>
  );
}
