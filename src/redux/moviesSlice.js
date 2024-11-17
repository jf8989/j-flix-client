// moviesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch("https://j-flix-omega.vercel.app/movies", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return data.map((movie) => ({
        _id: movie._id,
        title: movie.title,
        imageURL: movie.imageURL,
        description: movie.description,
        // Enhanced genre handling
        primaryGenre:
          Array.isArray(movie.genres) && movie.genres.length > 0
            ? movie.genres[0].name
            : movie.genre?.name || "Uncategorized",
        genres: Array.isArray(movie.genres)
          ? movie.genres.map((genre) => ({ name: genre.name }))
          : movie.genre
          ? [{ name: movie.genre.name }]
          : [],
        director: {
          name: movie.director?.name || "",
          bio: movie.director?.bio || "",
          birthYear: movie.director?.birthYear,
          deathYear: movie.director?.deathYear,
        },
        actors: movie.actors || [],
        featured: movie.featured || false,
        releaseYear: movie.releaseYear,
        rating: movie.rating,
      }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  list: [],
  filter: "",
  status: "idle",
  error: null,
};

export const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    clearFilter: (state) => {
      state.filter = "";
    },
    resetStatus: (state) => {
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setFilter, clearFilter, resetStatus } = moviesSlice.actions;

export default moviesSlice.reducer;
