// src/components/movie-card/movie-card.jsx
import React from 'react';

export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <div onClick={onMovieClick}>
      <h2>{movie.title}</h2>
    </div>
  );
};
