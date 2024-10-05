// src/components/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";

const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [showSignup, setShowSignup] = useState(false); // Manage login/signup toggle

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

  if (!user) {
    return showSignup ? (
      <SignupView
        onSignupSuccess={() => setShowSignup(false)}
        onLogin={() => setShowSignup(false)}
      />
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
            <p>Loading movies...</p>
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
