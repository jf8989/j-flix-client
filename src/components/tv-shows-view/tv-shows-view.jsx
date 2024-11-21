// src/components/tv-shows-view/tv-shows-view.jsx
import React from "react";
import { useSelector } from "react-redux"; // Add this import
import MoviesByGenre from "../genre-group/genre-group";
import "./tv-shows-view.scss";

const TVShowsView = ({ onToggleFavorite, userFavorites, filter }) => {
  // Get series directly from Redux store
  const series = useSelector((state) => state.series.list);

  return (
    <div className="tv-shows-view">
      <div className="tv-shows-header">
        <h1>TV Shows</h1>
        <p>Discover your next binge-worthy series</p>
      </div>
      <MoviesByGenre
        movies={series} // Pass only series data
        onToggleFavorite={onToggleFavorite}
        userFavorites={userFavorites}
        filter={filter}
      />
    </div>
  );
};

export default TVShowsView;
