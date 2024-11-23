import React from "react";
import { Route, Navigate, Routes, useLocation } from "react-router-dom";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { ProfileView } from "../profile-view/profile-view";
import { MyListView } from "../my-list-view/my-list-view";
import { UnderConstructionView } from "../under-construction/under-construction-view";
import { HelpCenter } from "../help-center/help-center";
import { KidsView } from "../kids-view/kids-view";
import TermsOfUse from "../tos-view/tos-view";
import CookiePreferences from "../cookies/cookie-preferences";
import Jobs from "../jobs-view/jobs-view";
import Contact from "../contact-view/contact-view";
import Privacy from "../privacy-view/privacy-view";
import PageTransition from "../page-transition/PageTransition";
import TVShowsView from "../tv-shows-view/tv-shows-view";
import MoviesOnlyView from "../movies-only-view/movies-only-view";
import AccountManagement from "../account-management/account-management";
import { AnimatePresence } from "framer-motion";

// In app-routes.jsx, update the props destructuring at the top:
const AppRoutes = ({
  user,
  token,
  movies,
  series,
  onLoggedIn,
  onLoggedOut,
  setUser,
  setToken,
  authError,
  onToggleFavorite,
  isFavorite,
  filteredContent,
  filter,
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition transitionType="fade" timing="smooth">
        <Routes>
          <Route
            path="/signup"
            element={
              <>
                {user ? (
                  <Navigate to="/" />
                ) : (
                  <SignupView
                    onSignupSuccess={(user, token) => {
                      setUser(user);
                      setToken(token);
                    }}
                  />
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
                  <LoginView onLoggedIn={onLoggedIn} authError={authError} />
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
                ) : (
                  <MovieView
                    movies={[
                      ...movies.map((movie) => ({
                        ...movie,
                        rating: movie.rating?.toString() || "N/A",
                        director: movie.director || { name: "N/A" }, // Provide default director
                      })),
                      ...series.map((show) => ({
                        ...show,
                        rating: show.rating?.toString() || "N/A",
                        director: show.creator || { name: "N/A" }, // Map creator to director for series
                      })),
                    ]}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={isFavorite}
                  />
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
                ) : (
                  <>
                    <div className="welcome-section">
                      <h1>
                        Welcome back,{" "}
                        <span className="highlight">{user.Username}</span>!
                      </h1>
                      <p>
                        Discover new stories or continue watching where you left
                        off.
                      </p>
                    </div>
                    <div className="movie-container">
                      <div className="movie-grid">
                        {(filteredContent || []).map(
                          (
                            item // Changed movie to item
                          ) => (
                            <div key={item._id} className="movie-card">
                              <MovieCard
                                movie={item} // Pass the item as movie prop
                                onToggleFavorite={onToggleFavorite}
                                isFavorite={isFavorite(item._id)}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
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
                    onLoggedOut={onLoggedOut}
                  />
                )}
              </>
            }
          />
          <Route
            path="/watchlist"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <MyListView
                    user={user}
                    movies={movies}
                    onToggleFavorite={onToggleFavorite}
                  />
                )}
              </>
            }
          />
          <Route
            path="/tvshows"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <TVShowsView
                    user={user} // Add this line
                    onToggleFavorite={onToggleFavorite}
                    userFavorites={user?.FavoriteMovies || []}
                    filter={filter || ""}
                  />
                )}
              </>
            }
          />
          <Route
            path="/movies"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <MoviesOnlyView
                    onToggleFavorite={onToggleFavorite}
                    userFavorites={user?.FavoriteMovies || []}
                    filter={filter || ""} // We'll get series data from Redux directly
                  />
                )}
              </>
            }
          />
          {/* Construction Routes */}
          {["/new", "/manage-profiles"].map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <>
                  {!user ? (
                    <Navigate to="/login" replace />
                  ) : (
                    <UnderConstructionView
                      user={user}
                      movies={movies}
                      onToggleFavorite={onToggleFavorite}
                    />
                  )}
                </>
              }
            />
          ))}
          {/* Help and Kids Routes */}
          <Route
            path="/help"
            element={
              <>{!user ? <Navigate to="/login" replace /> : <HelpCenter />}</>
            }
          />
          <Route
            path="/kids"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <KidsView
                    movies={movies}
                    onToggleFavorite={onToggleFavorite}
                  />
                )}
              </>
            }
          />
          <Route
            path="/account"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <AccountManagement
                    user={user}
                    token={token}
                    setUser={setUser}
                  />
                )}
              </>
            }
          />
          {/* Footer Routes */}
          {[
            "/audio-description",
            "/investor-relations",
            "/legal-notices",
            "/gift-cards",
            "/terms",
            "/corporate-information",
            "/media-center",
          ].map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <>
                  {!user ? (
                    <Navigate to="/login" replace />
                  ) : (
                    <UnderConstructionView
                      user={user}
                      movies={movies}
                      onToggleFavorite={onToggleFavorite}
                    />
                  )}
                </>
              }
            />
          ))}
          {/* Standalone Routes */}
          <Route
            path="/jobs"
            element={<>{!user ? <Navigate to="/login" replace /> : <Jobs />}</>}
          />
          <Route
            path="/cookie-preferences"
            element={
              <>
                {!user ? (
                  <Navigate to="/login" replace />
                ) : (
                  <CookiePreferences />
                )}
              </>
            }
          />
          <Route
            path="/privacy"
            element={
              <>{!user ? <Navigate to="/login" replace /> : <Privacy />}</>
            }
          />
          <Route
            path="/contact"
            element={
              <>{!user ? <Navigate to="/login" replace /> : <Contact />}</>
            }
          />
          <Route
            path="/tos"
            element={
              <>{!user ? <Navigate to="/login" replace /> : <TermsOfUse />}</>
            }
          />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
};

export default AppRoutes;
