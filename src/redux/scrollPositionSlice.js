// redux/scrollPositionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const scrollPositionSlice = createSlice({
  name: "scrollPosition",
  initialState: {
    positions: {}, // Will store scroll positions by genre
  },
  reducers: {
    setScrollPosition: (state, action) => {
      const { genre, position } = action.payload;
      state.positions[genre] = position;
    },
    clearScrollPositions: (state) => {
      state.positions = {};
    },
  },
});

export const { setScrollPosition, clearScrollPositions } =
  scrollPositionSlice.actions;
export default scrollPositionSlice.reducer;
