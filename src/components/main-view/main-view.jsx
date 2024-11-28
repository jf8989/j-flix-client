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
import ProfilePictureSelector from "../profile-picture-selector/profile-picture-selector";
import defaultProfilePic from "../../assets/images/profilepic.jpg";
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

  const [showProfileSelector, setShowProfileSelector] = useState(false);

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

      // Check which array contains the content
      const isInMovies = user.FavoriteMovies?.includes(contentId);
      const isInSeries = user.FavoriteSeries?.includes(contentId);

      // Determine if it's currently a favorite
      const isFavorite = isInMovies || isInSeries;

      // Check content type
      const isMovie = movies.some((m) => m._id === contentId);
      const contentType = isMovie ? "movies" : "series";

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
          // Update the correct array based on content type
          if (isMovie) {
            const updatedMovies = isFavorite
              ? user.FavoriteMovies.filter((id) => id !== contentId)
              : [...(user.FavoriteMovies || []), contentId];

            const newUser = {
              ...user,
              FavoriteMovies: updatedMovies,
              FavoriteSeries: user.FavoriteSeries || [], // Preserve series
            };
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
          } else {
            const updatedSeries = isFavorite
              ? user.FavoriteSeries.filter((id) => id !== contentId)
              : [...(user.FavoriteSeries || []), contentId];

            const newUser = {
              ...user,
              FavoriteMovies: user.FavoriteMovies || [], // Preserve movies
              FavoriteSeries: updatedSeries,
            };
            setUser(newUser);
            localStorage.setItem("user", JSON.stringify(newUser));
          }
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
    [user, token, movies]
  );

  const isFavorite = useCallback(
    (contentId) => {
      // Check both FavoriteMovies and FavoriteSeries arrays
      return (
        user?.FavoriteMovies?.includes(contentId) ||
        user?.FavoriteSeries?.includes(contentId) ||
        false
      );
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

  const handleProfilePictureChange = (newPicture) => {
    // Update the user state as before
    const newUser = {
      ...user,
      profilePicture: newPicture,
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));

    // Store profile preference separately with username as key
    if (user?.Username) {
      localStorage.setItem(`profilePicture_${user.Username}`, newPicture);
    }
    setShowProfileSelector(false);
  };

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
    // Load any stored profile picture preference for this user
    const storedProfilePic = localStorage.getItem(
      `profilePicture_${userData.Username}`
    );

    const enrichedUserData = {
      ...userData,
      profilePicture:
        storedProfilePic || userData?.profilePicture || defaultProfilePic,
    };

    // Update localStorage and state
    setUser(enrichedUserData);
    setToken(tokenData);
    localStorage.setItem("user", JSON.stringify(enrichedUserData));
    localStorage.setItem("token", tokenData);

    // Ensure profile picture preference is preserved
    if (storedProfilePic) {
      localStorage.setItem(
        `profilePicture_${userData.Username}`,
        storedProfilePic
      );
    }

    setAuthError(null);
  };

  const handleLoggedOut = () => {
    // Preserve the profile picture preferences before clearing
    const profilePictures = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("profilePicture_")) {
        profilePictures[key] = localStorage.getItem(key);
      }
    }

    // Clear authentication data
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Restore profile picture preferences
    Object.entries(profilePictures).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    // Reset state
    setUser(null);
    setToken(null);
  };

  return (
    <div className="app-container">
      {user && (
        <NavigationBar
          user={user}
          onLoggedOut={handleLoggedOut}
          onProfilePictureSelect={() => setShowProfileSelector(true)}
        />
      )}
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
              userFavorites={[
                ...(user?.FavoriteMovies || []),
                ...(user?.FavoriteSeries || []),
              ]} // Update this line to include both arrays
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
      <ProfilePictureSelector
        show={showProfileSelector}
        onHide={() => setShowProfileSelector(false)}
        onSelect={handleProfilePictureChange}
        currentPicture={user?.profilePicture}
      />
    </div>
  );
};

export default MainView;
