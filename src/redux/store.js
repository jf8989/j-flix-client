// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import moviesReducer from "./moviesSlice";
import loadingReducer from "./loadingSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["movies"], // Specify which slices you want to persist
};

const rootReducer = combineReducers({
  movies: moviesReducer,
  loading: loadingReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Redux Persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
