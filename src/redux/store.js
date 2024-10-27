import { configureStore } from "@reduxjs/toolkit";
import moviesReducer from "./moviesSlice";
import loadingReducer from "./loadingSlice";

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    loading: loadingReducer,
  },
});
