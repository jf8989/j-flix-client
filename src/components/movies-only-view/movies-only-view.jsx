// src/components/movies-only-view/movies-only-view.jsx
import React from "react";
import { useSelector } from "react-redux";
import MoviesByGenre from "../genre-group/genre-group";
import { BackArrow } from "../back-arrow/back-arrow";
import "./movies-only-view.scss";

const MoviesOnlyView = ({ onToggleFavorite, userFavorites, filter }) => {
  // Get movies directly from Redux store
  const movies = useSelector((state) => state.movies.list);

  return (
    <div className="tv-shows-view">
      <div className="tv-shows-header">
        <div className="d-flex align-items-center mb-3">
          <BackArrow className="me-3" />
          <h1>Movies</h1>
        </div>
        <p>Explore our collection of movies</p>
      </div>
      <MoviesByGenre
        movies={movies} // Pass only movies data
        onToggleFavorite={onToggleFavorite}
        userFavorites={userFavorites}
        filter={filter}
      />
    </div>
  );
};

export default MoviesOnlyView;
