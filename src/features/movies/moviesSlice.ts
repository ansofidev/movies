import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Movie } from '../types';
import axios from '../../api/axios';

interface MoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
};

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const response = await axios.get('/movies?limit=1000'); // 👈 Додано limit
  console.log('API response:', response.data);
  return response.data.data;
});

export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movie: Movie, { rejectWithValue }) => {
    const response = await axios.post('/movies', movie);
    console.log('createMovie response:', response.data);

    if (response.data.status !== 1) {
      return rejectWithValue(response.data.error);
    }

    return response.data.data;
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
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
        if (action.payload?.title) {
          state.movies.push(action.payload);
        }
      })
      .addCase(createMovie.rejected, (_state, action) => {
        console.warn('Failed to create movie:', action.payload);
      });
  },
});

export default moviesSlice.reducer;
