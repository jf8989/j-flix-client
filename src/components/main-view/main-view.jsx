import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import { Row, Col, Alert, Spinner, Container } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import { MovieFilter } from "../movie-filter/movie-filter";
import { fetchMovies } from "../../redux/moviesSlice";
import { Footer } from "../footer/footer";

const MainView = () => {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies.list);
  const filter = useSelector((state) => state.movies.filter);
  const moviesStatus = useSelector((state) => state.movies.status);
  const error = useSelector((state) => state.movies.error);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);

  useEffect(() => {
    if (token && moviesStatus === "idle") {
      dispatch(fetchMovies(token));
    }
  }, [token, moviesStatus, dispatch]);

  const onToggleFavorite = useCallback(
    (movieId) => {
      if (!user || !user.Username) {
        console.error("User is not logged in or username is missing");
        return;
      }

      const isFavorite = user.FavoriteMovies.includes(movieId);
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
          const updatedFavorites = isFavorite
            ? user.FavoriteMovies.filter((id) => id !== movieId)
            : [...user.FavoriteMovies, movieId];

          const newUser = {
            ...user,
            FavoriteMovies: updatedFavorites,
          };

          setUser(newUser);
          localStorage.setItem("user", JSON.stringify(newUser));

          alert(
            isFavorite
              ? "Movie removed from favorites!"
              : "Movie added to favorites!"
          );
        })
        .catch((error) => {
          console.error("Error updating favorites:", error);
        });
    },
    [user, token]
  );

  const filteredMovies = useMemo(
    () =>
      movies.filter((movie) =>
        movie.title.toLowerCase().includes(filter.toLowerCase())
      ),
    [movies, filter]
  );

  if (moviesStatus === "loading") {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  if (moviesStatus === "failed") {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  return (
    <Router>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
          localStorage.clear();
        }}
      />
      <Container fluid>
        <Routes>
          <Route
            path="/signup"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <Row className="justify-content-md-center">
                    <Col md={5}>
                      <SignupView />
                    </Col>
                  </Row>
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
                  <Row className="justify-content-md-center">
                    <Col md={5}>
                      <LoginView
                        onLoggedIn={(user, token) => {
                          setUser(user);
                          setToken(token);
                          localStorage.setItem("user", JSON.stringify(user));
                          localStorage.setItem("token", token);
                        }}
                      />
                    </Col>
                  </Row>
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
                  <Row className="justify-content-md-center">
                    <Col md={8}>
                      <MovieView
                        movies={movies}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={(movieId) =>
                          user?.FavoriteMovies?.includes(movieId) || false
                        }
                      />
                    </Col>
                  </Row>
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
                    <MovieFilter />
                    <Row>
                      {filteredMovies.map((movie) => (
                        <Col className="mb-4" key={movie._id} md={3}>
                          <MovieCard
                            movie={movie}
                            onToggleFavorite={onToggleFavorite}
                            isFavorite={user.FavoriteMovies.includes(movie._id)}
                          />
                        </Col>
                      ))}
                    </Row>
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
                )}
              </>
            }
          />
        </Routes>
      </Container>
      <Footer /> {/* Add the Footer component here */}
    </Router>
  );
};

export default MainView;
