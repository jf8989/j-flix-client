// src/components/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

const MainView = () => {
  const [movies, setMovies] = useState([]); // Movies state
  const [selectedMovie, setSelectedMovie] = useState(null); // Selected movie state
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  ); // User state from localStorage
  const [showSignup, setShowSignup] = useState(false); // Toggle between login and signup

  // Fetch movies only when user is authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://j-flix-omega.vercel.app/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => setMovies(data))
        .catch((error) => console.error("Error fetching movies:", error));
    }
  }, [user]);

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); // Reset user state and log out
  };

  // If no user is logged in, show the login or signup form
  if (!user) {
    return showSignup ? (
      <SignupView onSignup={() => setShowSignup(false)} />
    ) : (
      <LoginView
        onLoggedIn={(user) => setUser(user)}
        onSignup={() => setShowSignup(true)}
      />
    );
  }

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
