// moviesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch("https://j-flix-omega.vercel.app/movies", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Received non-JSON response from server");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error fetching movies");
      }

      // Handle empty array response
      if (!Array.isArray(data)) {
        console.warn("Received non-array data:", data);
        return [];
      }

      return data.map((movie) => ({
        _id: movie._id || "",
        title: movie.title || "Untitled",
        imageURL:
          movie.imageURL || "https://via.placeholder.com/300x450?text=No+Image",
        description: movie.description || "No description available",
        genre: {
          name: movie.genre?.name || "Unspecified",
          description: movie.genre?.description || "",
        },
        director: {
          name: movie.director?.name || "Unknown",
          bio: movie.director?.bio || "",
          birthYear: movie.director?.birthYear || null,
          deathYear: movie.director?.deathYear || null,
        },
        actors: Array.isArray(movie.actors) ? movie.actors : [],
        featured: Boolean(movie.featured),
        releaseYear: movie.releaseYear || null,
        rating: movie.rating || null,
      }));
    } catch (error) {
      console.error("Error details:", error);
      // If we have a response error
      if (error.message) {
        return rejectWithValue(error.message);
      }
      // For network/other errors
      return rejectWithValue("Failed to fetch movies. Please try again later.");
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
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch movies";
        // Keep existing movies in state if fetch fails
      });
  },
});

export const { setFilter, clearError } = moviesSlice.actions;

export default moviesSlice.reducer;
