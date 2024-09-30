// src/components/movie-card/movie-card.jsx
import React from "react";
import PropTypes from "prop-types"; // Import PropTypes

export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <div onClick={onMovieClick}>
      <h2>{movie.title}</h2>
    </div>
  );
};

// Add PropTypes validation
MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired,
};
