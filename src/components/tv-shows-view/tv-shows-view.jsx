// src/components/tv-shows-view/tv-shows-view.jsx
import React from "react";
import { useSelector } from "react-redux";
import MoviesByGenre from "../genre-group/genre-group";
import { BackArrow } from "../back-arrow/back-arrow";
import "./tv-shows-view.scss";

const TVShowsView = ({ user, onToggleFavorite, userFavorites, filter }) => {
  // Add user to props
  // Get series directly from Redux store
  const series = useSelector((state) => state.series.list);

  // Combine both favorite arrays if they exist
  const allFavorites = [
    ...(userFavorites || []),
    ...(user?.FavoriteSeries || []),
  ];

  return (
    <div className="tv-shows-view">
      <div className="tv-shows-header">
        <div className="d-flex align-items-center mb-3">
          <BackArrow className="me-3" />
          <h1>TV Shows</h1>
        </div>
        <p>Discover your next binge-worthy series</p>
      </div>
      <MoviesByGenre
        movies={series}
        onToggleFavorite={onToggleFavorite}
        userFavorites={allFavorites}
        filter={filter}
      />
    </div>
  );
};

export default TVShowsView;
