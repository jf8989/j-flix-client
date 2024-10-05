// src/components/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
import { Row, Col, Button, Card } from "react-bootstrap";
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
  const [showSignup, setShowSignup] = useState(false);

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
    setUser(null);
  };

  if (!user) {
    return (
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              {showSignup ? (
                <SignupView
                  onSignupSuccess={() => setShowSignup(false)}
                  onLogin={() => setShowSignup(false)}
                />
              ) : (
                <LoginView
                  onLoggedIn={(user) => setUser(user)}
                  onSignup={() => setShowSignup(true)}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <Row className="mb-4">
        <Col>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>
      {selectedMovie ? (
        <Row>
          <Col>
            <MovieView
              movie={selectedMovie}
              onBackClick={() => setSelectedMovie(null)}
            />
          </Col>
        </Row>
      ) : (
        <Row>
          {movies.length === 0 ? (
            <Col>
              <p>Loading movies...</p>
            </Col>
          ) : (
            movies.map((movie) => (
              <Col
                key={movie._id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="mb-4"
              >
                <MovieCard
                  movie={movie}
                  onMovieClick={() => handleMovieClick(movie)}
                />
              </Col>
            ))
          )}
        </Row>
      )}
    </>
  );
};

export default MainView;
