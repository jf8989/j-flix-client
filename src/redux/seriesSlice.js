import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchSeries = createAsyncThunk(
  "series/fetchSeries",
  async (token, { rejectWithValue }) => {
    try {
      const response = await fetch("https://j-flix-omega.vercel.app/series", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      return data.map((series) => ({
        _id: series._id,
        title: series.title,
        imageURL: series.imageURL,
        description: series.description,
        primaryGenre:
          Array.isArray(series.genres) && series.genres.length > 0
            ? series.genres[0].name
            : series.genre?.name || "Uncategorized",
        genres: Array.isArray(series.genres)
          ? series.genres.map((genre) => ({ name: genre.name }))
          : series.genre
          ? [{ name: series.genre.name }]
          : [],
        creator: {
          name: series.creator?.name || "",
          bio: series.creator?.bio || "",
        },
        actors: series.actors || [],
        featured: series.featured || false,
        firstAirYear: series.firstAirYear,
        lastAirYear: series.lastAirYear,
        rating: series.rating,
        status: series.status,
        numberOfSeasons: series.numberOfSeasons,
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

export const seriesSlice = createSlice({
  name: "series",
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
      .addCase(fetchSeries.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSeries.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchSeries.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setFilter, clearFilter, resetStatus } = seriesSlice.actions;

export default seriesSlice.reducer;
