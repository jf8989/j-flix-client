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
import { AnimatePresence } from "framer-motion";

const AppRoutes = ({
  user,
  token,
  movies,
  onLoggedIn,
  onLoggedOut,
  setUser,
  setToken,
  authError,
  onToggleFavorite,
  isFavorite,
  filteredMovies,
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
                    movies={movies.map((movie) => ({
                      ...movie,
                      rating: movie.rating?.toString() || "N/A",
                    }))}
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
                        {filteredMovies.map((movie) => (
                          <div key={movie._id} className="movie-card">
                            <MovieCard
                              movie={movie}
                              onToggleFavorite={onToggleFavorite}
                              isFavorite={isFavorite(movie._id)}
                            />
                          </div>
                        ))}
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
            path="/mylist"
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
          {/* Construction Routes */}
          {["/new", "/movies", "/tvshows", "/manage-profiles", "/account"].map(
            (path) => (
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
            )
          )}
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
