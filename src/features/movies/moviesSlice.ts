import { createSlice } from '@reduxjs/toolkit';
import type { Movie } from './types';

interface MoviesState {
  movies: Movie[];
  selectedMovie: Movie | null;
}

const initialState: MoviesState = {
  movies: [],
  selectedMovie: null,
};

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
});

export const { setMovies, setSelectedMovie, clearSelectedMovie } = moviesSlice.actions;
export default moviesSlice.reducer;
