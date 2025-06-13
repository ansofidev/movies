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
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data || axiosError.message || 'Unexpected error';
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

    const workers = [];
    for (let i = 0; i < concurrencyLimit; i++) {
      workers.push(worker());
    }

    await Promise.all(workers);
  }
);

export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movie: Movie, { rejectWithValue }) => {
    try {
      const newMovie = {
        title: movie.title,
        year: movie.year,
        format: movie.format,
        actors: movie.actors,
      };

      const response = await axios.post('/movies', newMovie);
      if (response.data.status !== 1) {
        return rejectWithValue(response.data.error);
      }

      return response.data.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data || axiosError.message || 'Unexpected error';
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
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data || axiosError.message || 'Unexpected error';
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
          detailsFetched: movie.actors && movie.actors.length > 0,
        }));
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch movies';
      })

      .addCase(fetchMovieDetails.pending, (state, action) => {
        const movie = state.movies.find(m => m.id === action.meta.arg);
        if (movie) {
          movie.detailsFetched = true;
        }
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        const index = state.movies.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.movies[index] = { ...action.payload, detailsFetched: true };
        } else {
          state.movies.push({ ...action.payload, detailsFetched: true });
        }
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to fetch movie details';
      })

      .addCase(createMovie.fulfilled, () => {})

      .addCase(createMovie.rejected, (state, action) => {
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to create movie';
      })

      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter((movie) => movie.id !== action.payload);
      })
      .addCase(deleteMovie.rejected, (state, action) => {
        state.error = typeof action.payload === 'string' ? action.payload : 'Failed to delete movie';
      });
  },
});

export default moviesSlice.reducer;
