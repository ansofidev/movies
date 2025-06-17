import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Movie } from '../types';
import axios from '../../api/axios';
import { AxiosError } from 'axios';

interface MovieWithFlag extends Movie {
  detailsFetched?: boolean;
}

interface MoviesState {
  movies: MovieWithFlag[];
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  movies: [],
  loading: false,
  error: null,
};

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const response = await axios.get('/movies?limit=1000');
  return response.data.data;
});

export const fetchMovieDetails = createAsyncThunk(
  'movies/fetchMovieDetails',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/movies/${id}`);
      if (response.data.status !== 1) {
        return rejectWithValue(response.data.error);
      }
      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const errorMessage =
        axiosError.response?.data?.error || axiosError.message || 'Unexpected error';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchMissingMovieDetails = createAsyncThunk<
  void,
  MovieWithFlag[],
  { state: { movies: MoviesState } }
>(
  'movies/fetchMissingMovieDetails',
  async (movies, { dispatch }) => {
    const concurrencyLimit = 5;

    const missingMovies = movies.filter(
      (m): m is MovieWithFlag & { id: number } => !!m.id && !m.detailsFetched
    );

    let index = 0;
    async function worker() {
      while (index < missingMovies.length) {
        const movie = missingMovies[index++];
        await dispatch(fetchMovieDetails(movie.id));
      }
    }

    const workers = Array.from({ length: concurrencyLimit }, () => worker());
    await Promise.all(workers);
  }
);

export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movie: Movie, { rejectWithValue }) => {
    try {
      const response = await axios.post('/movies', movie);

      if (response.data.status !== 1) {
        return rejectWithValue(
          typeof response.data.error === 'string'
            ? response.data.error
            : 'The movie could not be added.'
        );
      }

      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const errorData = axiosError.response?.data;

      let errorMessage = 'An unexpected error occurred while adding the movie.';

      if (errorData?.error) {
        errorMessage = errorData.error;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteMovie = createAsyncThunk(
  'movies/deleteMovie',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/movies/${id}`);
      if (response.data.status !== 1) {
        return rejectWithValue(response.data.error);
      }
      return id;
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;
      const errorMessage =
        axiosError.response?.data?.error || axiosError.message || 'Unexpected error';
      return rejectWithValue(errorMessage);
    }
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
        state.movies = action.payload.map((movie: Movie) => ({
          ...movie,
          detailsFetched: movie.actors?.length > 0,
        }));
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch movies';
      })

      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        const index = state.movies.findIndex((m) => m.id === action.payload.id);
        if (index !== -1) {
          state.movies[index] = { ...action.payload, detailsFetched: true };
        } else {
          state.movies.push({ ...action.payload, detailsFetched: true });
        }
      })

      .addCase(createMovie.rejected, (state, action) => {
        state.error = typeof action.payload === 'string'
          ? action.payload
          : 'Failed to create movie';
      })

      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter((movie) => movie.id !== action.payload);
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.error = typeof action.payload === 'string'
          ? action.payload
          : 'Failed to delete movie';
      });
  },
});

export default moviesSlice.reducer;
