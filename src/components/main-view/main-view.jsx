import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { fetchMovies } from "../../redux/moviesSlice";
import { Footer } from "../footer/footer";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import AppRoutes from "../app-routes/app-routes";
import "./main-view.scss";

// Token validation helper
const isTokenValid = (token) => {
  if (!token) return false;

  try {
    // Parse the JWT token (split by dots and get the payload)
    const payload = JSON.parse(atob(token.split(".")[1]));
    // Check if token has expired
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

const MainView = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const movies = useSelector((state) => state.movies.list);
  const filter = useSelector((state) => state.movies.filter);
  const moviesStatus = useSelector((state) => state.movies.status);
  const error = useSelector((state) => state.movies.error);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const storedToken = localStorage.getItem("token");

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);
  const [authError, setAuthError] = useState(null);

  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Check token validity on mount and when token changes
  useEffect(() => {
    if (token && !isTokenValid(token)) {
      // Token is invalid or expired - log out user
      setUser(null);
      setToken(null);
      localStorage.clear();
      setAuthError("Your session has expired. Please log in again.");
    }
  }, [token]);

  useEffect(() => {
    if (token && moviesStatus === "idle") {
      dispatch(fetchMovies(token))
        .unwrap()
        .catch((error) => {
          if (error.status === 401) {
            // Unauthorized - clear user data and redirect to login
            setUser(null);
            setToken(null);
            localStorage.clear();
            setAuthError("Your session has expired. Please log in again.");
          }
        });
    }
  }, [token, moviesStatus, dispatch]);

  const onToggleFavorite = useCallback(
    (movieId) => {
      if (!user || !user.Username) {
        console.error("User is not logged in or username is missing");
        return;
      }

      const isFavorite = user.FavoriteMovies.includes(movieId);
      // Add console.log for debugging
      console.log("User:", user.Username);
      console.log("MovieId:", movieId);
      console.log("IsFavorite:", isFavorite);

      const url = `https://j-flix-omega.vercel.app/users/${user.Username}/movies/${movieId}`;
      console.log("Request URL:", url); // Log the constructed URL

      const method = isFavorite ? "DELETE" : "POST";

      fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          console.log("Response status:", response.status); // Log response status
          if (response.status === 401) {
            throw new Error("unauthorized");
          }
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
        })
        .catch((error) => {
          if (error.message === "unauthorized") {
            setUser(null);
            setToken(null);
            localStorage.clear();
            setAuthError("Your session has expired. Please log in again.");
          } else {
            console.error("Error updating favorites:", error);
          }
        });
    },
    [user, token]
  );

  const isFavorite = useCallback(
    (movieId) => {
      return (
        user && user.FavoriteMovies && user.FavoriteMovies.includes(movieId)
      );
    },
    [user]
  );

  const filteredMovies = useMemo(
    () =>
      movies.filter((movie) =>
        movie.title.toLowerCase().includes(filter.toLowerCase())
      ),
    [movies, filter]
  );

  if (authError) {
    return <Navigate to="/login" replace />;
  }

  if (moviesStatus === "loading") {
    return <LoadingSpinner />;
  }

  if (moviesStatus === "failed" && error !== "unauthorized") {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  const handleLoggedIn = (user, token) => {
    setUser(user);
    setToken(token);
    setAuthError(null);
  };

  const handleLoggedOut = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  return (
    <div className="app-container">
      {user && <NavigationBar user={user} onLoggedOut={handleLoggedOut} />}
      <main className="main-content">
        <AppRoutes
          user={user}
          token={token}
          movies={movies}
          onLoggedIn={handleLoggedIn}
          onLoggedOut={handleLoggedOut}
          setUser={setUser}
          setToken={setToken}
          authError={authError}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
          filteredMovies={filteredMovies}
        />
      </main>
      <Footer />
    </div>
  );
};

export default MainView;
