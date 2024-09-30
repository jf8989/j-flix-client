// src/components/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

const MainView = () => {
  const [movies, setMovies] = useState([]); // Initial state with an empty array
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Fetch movie data when the component mounts
  useEffect(() => {
    fetch("https://j-flix-omega.vercel.app/movies") // Replace with your actual API URL
      .then((response) => response.json())
      .then((data) => setMovies(data))
      .catch((error) => console.error("Error fetching movies:", error));
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // reset user state
  };

  return (
    <div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {selectedMovie ? (
        <MovieView
          movie={selectedMovie}
          onBackClick={() => setSelectedMovie(null)}
        />
      ) : (
        <div>
          {movies.length === 0 ? (
            <p>Loading movies...</p> // Display a loading message until movies are fetched
          ) : (
            movies.map((movie) => (
              <MovieCard
                key={movie._id}
                movie={movie}
                onMovieClick={() => handleMovieClick(movie)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MainView;
