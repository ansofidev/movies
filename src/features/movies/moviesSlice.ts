import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Movie } from '../types';
import axios from '../../api/axios'

interface MoviesState {
  movies: Movie[];
  selectedMovie: Movie | null;
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  movies: [],
  selectedMovie: null,
  loading: false,
  error: null,
};

// 🔹 GET /movies
export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const response = await axios.get('/movies');
  console.log('📦 API response:', response.data);
  return response.data.data;
});

// 🔹 POST /movies
export const createMovie = createAsyncThunk('movies/createMovie', async (movie: Movie) => {
  const response = await axios.post<Movie>('/movies', movie);
  return response.data;
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch movies';
      })

      .addCase(createMovie.fulfilled, (state, action) => {
        state.movies = [...state.movies, action.payload];
      });
  },
});

export const { setMovies, setSelectedMovie, clearSelectedMovie } = moviesSlice.actions;
export default moviesSlice.reducer;
