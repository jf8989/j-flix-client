import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { fetchMovies } from "../../redux/moviesSlice";
import { fetchSeries } from "../../redux/seriesSlice";
import { Footer } from "../footer/footer";
import LoadingSpinner from "../loading-spinner/loading-spinner";
import AppRoutes from "../app-routes/app-routes";
import MoviesByGenre from "../genre-group/genre-group";
import "./main-view.scss";

// Token validation helper
const isTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

const MainView = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const movies = useSelector((state) => state.movies.list);
  const series = useSelector((state) => state.series.list);
  const filter = useSelector((state) => state.movies.filter); // Using movies filter for both
  const moviesStatus = useSelector((state) => state.movies.status);
  const seriesStatus = useSelector((state) => state.series.status);
  const error = useSelector(
    (state) => state.movies.error || state.series.error
  );
  const location = useLocation();

  // Initialize state from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token");
  });

  const [authError, setAuthError] = useState(null);

  // State for controlling animation
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Ref to store previous pathname
  const prevPathnameRef = useRef();

  useEffect(() => {
    if (pathname === "/" && user) {
      // Only trigger animation when navigating to home page
      if (prevPathnameRef.current !== pathname) {
        setShouldAnimate(false);
        const timeoutId = setTimeout(() => {
          setShouldAnimate(true);
        }, 50);
        return () => clearTimeout(timeoutId);
      }
    }
    prevPathnameRef.current = pathname;
  }, [pathname]);

  // Check token validity on mount and when token changes
  useEffect(() => {
    if (token && !isTokenValid(token)) {
      setUser(null);
      setToken(null);
      localStorage.clear();
      setAuthError("Your session has expired. Please log in again.");
    }
  }, [token]);

  // Fetch both movies and series when token is available
  useEffect(() => {
    if (token) {
      Promise.all([
        dispatch(fetchMovies(token)).unwrap(),
        dispatch(fetchSeries(token)).unwrap(),
      ]).catch((error) => {
        if (error.status === 401) {
          setUser(null);
          setToken(null);
          localStorage.clear();
          setAuthError("Your session has expired. Please log in again.");
        }
      });
    }
  }, [token, dispatch]);

  const onToggleFavorite = useCallback(
    (contentId) => {
      if (!user || !user.Username) {
        console.error("User is not logged in or username is missing");
        return;
      }

      const isFavorite = user.FavoriteMovies.includes(contentId);

      // Local check using the Redux store data
      const contentType = movies.find((m) => m._id === contentId)
        ? "movies"
        : "series";

      const url = `https://j-flix-omega.vercel.app/users/${user.Username}/${contentType}/${contentId}`;
      const method = isFavorite ? "DELETE" : "POST";

      fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 401) {
            throw new Error("unauthorized");
          }
          if (!response.ok) {
            throw new Error(`Failed to update favorites: ${response.status}`);
          }
          return response.json();
        })
        .then((updatedUser) => {
          const updatedFavorites = isFavorite
            ? user.FavoriteMovies.filter((id) => id !== contentId)
            : [...user.FavoriteMovies, contentId];

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
    [user, token] // No need to include movies or series in dependencies as they're from Redux
  );

  const isFavorite = useCallback(
    (contentId) => {
      return user?.FavoriteMovies?.includes(contentId) || false;
    },
    [user]
  );

  // Combine and filter both movies and series
  const filteredContent = useMemo(() => {
    const lowerFilter = filter.toLowerCase();
    const filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(lowerFilter)
    );
    const filteredSeries = series.filter((show) =>
      show.title.toLowerCase().includes(lowerFilter)
    );
    return [...filteredMovies, ...filteredSeries];
  }, [movies, series, filter]);

  if (authError) {
    return <Navigate to="/login" replace />;
  }

  // Show loading spinner if either movies or series are loading
  if (moviesStatus === "loading" || seriesStatus === "loading") {
    return <LoadingSpinner />;
  }

  // Show error if either movies or series failed to load
  if (
    (moviesStatus === "failed" || seriesStatus === "failed") &&
    error !== "unauthorized"
  ) {
    return <Alert variant="danger">Error: {error}</Alert>;
  }

  const handleLoggedIn = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData);
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
        {user && pathname === "/" ? (
          <div
            className={`movie-groups-container ${
              shouldAnimate ? "animate" : ""
            }`}
          >
            <MoviesByGenre
              movies={[...movies, ...series]}
              onToggleFavorite={onToggleFavorite}
              userFavorites={user?.FavoriteMovies || []}
              filter={filter}
            />
          </div>
        ) : (
          <AppRoutes
            user={user}
            token={token}
            movies={movies}
            series={series}
            onLoggedIn={handleLoggedIn}
            onLoggedOut={handleLoggedOut}
            setUser={setUser}
            setToken={setToken}
            authError={authError}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite}
            filteredContent={filteredContent}
            filter={filter}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MainView;
