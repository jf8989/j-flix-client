import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  filter: "",
};

export const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setMovies: (state, action) => {
      state.list = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const { setMovies, setFilter } = moviesSlice.actions;

export default moviesSlice.reducer;
