// src/components/main-view/main-view.jsx
import React, { useState } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

const MainView = () => {
  const [movies] = useState([
    { id: 1, title: 'Inception', description: 'A mind-bending thriller', director: 'Christopher Nolan', genre: 'Sci-Fi' },
    { id: 2, title: 'The Matrix', description: 'A dystopian future', director: 'Wachowski Sisters', genre: 'Sci-Fi' },
    { id: 3, title: 'Interstellar', description: 'A journey through space', director: 'Christopher Nolan', genre: 'Sci-Fi' }
  ]);

  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  return (
    <div>
      {selectedMovie ? (
        <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
      ) : (
        <div>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onMovieClick={() => handleMovieClick(movie)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainView;