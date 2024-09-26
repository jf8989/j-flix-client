// src/components/movie-view/movie-view.jsx
import React from 'react';

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <h2>{movie.title}</h2>
      <p>{movie.description}</p>
      <p><strong>Director:</strong> {movie.director}</p>
      <p><strong>Genre:</strong> {movie.genre}</p>
      <button onClick={onBackClick}>Back</button>
    </div>
  );
};
