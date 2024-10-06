// src/components/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";

const MainView = () => {
  let storedUser = localStorage.getItem("user");
  let parsedUser = null;

  try {
    parsedUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    parsedUser = null;
  }

  const storedToken = localStorage.getItem("token");

  const [user, setUser] = useState(
    parsedUser
      ? {
          ...parsedUser,
          favoriteMovies:
            parsedUser.favoriteMovies || parsedUser.FavoriteMovies || [],
        }
      : null
  );
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch("https://j-flix-omega.vercel.app/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        const moviesFromApi = data.map((movie) => {
          return {
            _id: movie._id,
            title: movie.title,
            imageURL: movie.imageURL,
            description: movie.description,
            genre: {
              name: movie.genre.name,
              description: movie.genre.description,
            },
            director: {
              name: movie.director.name,
            },
          };
        });
        setMovies(moviesFromApi);
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
      });
  }, [token]);

  const onToggleFavorite = (movieId) => {
    if (!user || !user.Username) {
      console.error("User is not logged in or username is missing");
      return;
    }

    const isFavorite = user.favoriteMovies.includes(movieId);
    const url = `https://j-flix-omega.vercel.app/users/${user.Username}/movies/${movieId}`;
    const method = isFavorite ? "DELETE" : "POST";

    fetch(url, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update favorites");
        }
        return response.json();
      })
      .then((updatedUser) => {
        setUser({
          ...user,
          favoriteMovies:
            updatedUser.favoriteMovies || updatedUser.FavoriteMovies,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...updatedUser,
            favoriteMovies:
              updatedUser.favoriteMovies || updatedUser.FavoriteMovies,
          })
        );
        alert(
          isFavorite
            ? "Movie removed from favorites!"
            : "Movie added to favorites!"
        );
      })
      .catch((error) => {
        console.error("Error updating favorites:", error);
      });
  };

  return (
    <Router>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
          localStorage.clear();
        }}
        onSearch={setSearchQuery}
      />
      <Row className="justify-content-md-center">
        <Routes>
          <Route
            path="/signup"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <SignupView
                      onSignupSuccess={(user, token) => {
                        // Set the user and token in the state and localStorage
                        const userWithFavorites = {
                          ...user,
                          favoriteMovies: user.favoriteMovies || [],
                        };
                        setUser(userWithFavorites);
                        setToken(token);

                        // Redirect to home after successful signup and login
                        window.location.href = "/";
                      }}
                    />
                  </Col>
                )}
              </>
            }
          />

          <Route
            path="/login"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Col md={5}>
                    <LoginView
                      onLoggedIn={(user, token) => {
                        const userWithFavorites = {
                          ...user,
                          favoriteMovies: user.favoriteMovies || [],
                        };
                        setUser(userWithFavorites);
                        setToken(token);
                      }}
                    />
                  </Col>
                )}
              </>
            }
          />
          <Route
            path="/movies/:movieId"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <Col md={8}>
                    <MovieView
                      movies={movies}
                      onToggleFavorite={onToggleFavorite}
                      isFavorite={(movieId) =>
                        user?.FavoriteMovies?.includes(movieId) || false
                      } // Ensuring boolean
                    />
                  </Col>
                )}
              </>
            }
          />

          <Route
            path="/"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : movies.length === 0 ? (
                  <Col>The list is empty!</Col>
                ) : (
                  <>
                    {movies
                      .filter((movie) =>
                        movie.title
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                      .map((movie) => (
                        <Col className="mb-4" key={movie._id} md={3}>
                          <MovieCard
                            movie={movie}
                            onToggleFavorite={onToggleFavorite}
                            isFavorite={
                              user?.FavoriteMovies?.includes(movie._id) || false
                            } // Ensuring boolean
                          />
                        </Col>
                      ))}
                  </>
                )}
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <Col md={8}>
                    <ProfileView
                      user={user}
                      token={token}
                      setUser={setUser}
                      movies={movies}
                      onLoggedOut={() => {
                        setUser(null);
                        setToken(null);
                        localStorage.clear();
                      }}
                    />
                  </Col>
                )}
              </>
            }
          />
        </Routes>
      </Row>
    </Router>
  );
};

export default MainView;
