// MovieView.jsx
import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import MovieImage from "../movie-image/movie-image";
import { BackArrow } from "../back-arrow/back-arrow";
import { useDispatch } from "react-redux";
import { clearFilter } from "../../redux/moviesSlice";
import "./movie-view.scss";

export const MovieView = ({ movies, onToggleFavorite, isFavorite }) => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const movie = movies.find((m) => m._id === movieId);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearFilter());
  }, [dispatch]);

  useEffect(() => {
    let snackbarTimer;
    if (showSnackbar) {
      snackbarTimer = setTimeout(() => {
        setShowSnackbar(false);
      }, 1200);
    }
    return () => {
      if (snackbarTimer) {
        clearTimeout(snackbarTimer);
      }
    };
  }, [showSnackbar]);

  const handleToggleFavorite = useCallback(
    (movieId) => {
      const currentState = isFavorite(movieId);
      onToggleFavorite(movieId);

      setSnackbarMessage(
        currentState ? "Removed from Favorites" : "Added to Favorites"
      );
      setShowSnackbar(true);
    },
    [isFavorite, onToggleFavorite]
  );

  if (!movie) {
    return <div>Movie not found</div>;
  }

  const favoriteButtonClass = `favorite-button ${
    isFavorite(movie._id) ? "favorite" : ""
  }`;

  return (
    <div className="movie-view">
      <Container className="custom-margin-top">
        <Row className="align-items-center mb-4">
          <Col xs="auto">
            <BackArrow className="mt-1" />
          </Col>
          <Col>
            <h2 className="text-white mb-0">{movie.title}</h2>
          </Col>
        </Row>
        <Row className="g-4">
          {/* First column with movie image and favorite button */}
          <Col md={4}>
            <Card className="bg-dark text-white h-100">
              <MovieImage
                imageURL={movie.imageURL}
                title={movie.title}
                className="w-full h-auto"
              />
              <Card.Body className="d-flex flex-column">
                <div className="text-center mb-3">
                  <span
                    className="me-2 px-2 py-1 rounded"
                    style={{
                      backgroundColor: "#e50914",
                      display: "inline-block",
                    }}
                  >
                    ★ {movie.rating || "N/A"}
                  </span>
                  <span
                    className="px-2 py-1 rounded"
                    style={{
                      backgroundColor: "#221f1f",
                      display: "inline-block",
                    }}
                  >
                    {movie.releaseYear || "N/A"}
                  </span>
                </div>
                <Button
                  onClick={() => handleToggleFavorite(movie._id)}
                  className={favoriteButtonClass}
                >
                  {isFavorite(movie._id)
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Second column with movie details */}
          <Col md={8}>
            <Card className="bg-dark text-white h-100">
              <Card.Body>
                {/* Movie description */}
                <div className="mb-4">
                  <Card.Text className="lead">{movie.description}</Card.Text>
                </div>

                {/* Director information */}
                <div className="mb-4">
                  <h3 className="h4 mb-3">Director</h3>
                  <Card.Text>
                    <span style={{ color: "#e50914" }}>Name: </span>
                    {movie.director.name}
                  </Card.Text>
                  {movie.director.bio && (
                    <Card.Text>
                      <span style={{ color: "#e50914" }}>Bio: </span>
                      {movie.director.bio}
                    </Card.Text>
                  )}
                  {movie.director.birthYear && (
                    <Card.Text>
                      <span style={{ color: "#e50914" }}>Birth Year: </span>
                      {movie.director.birthYear}
                    </Card.Text>
                  )}
                </div>

                {/* Genre information */}
                <div className="mb-4">
                  <h3 className="h4 mb-3">Genres</h3>
                  <div className="d-flex flex-wrap gap-2">
                    {movie.genres && movie.genres.length > 0 ? (
                      movie.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded"
                          style={{ backgroundColor: "#221f1f" }}
                        >
                          {genre.name}
                        </span>
                      ))
                    ) : (
                      <Card.Text>No genre information available</Card.Text>
                    )}
                  </div>
                </div>

                {/* Cast section */}
                <div className="mb-4">
                  <h3 className="h4 mb-3">Cast</h3>
                  <div className="d-flex flex-wrap gap-2">
                    {movie.actors &&
                      movie.actors.map((actor, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 rounded"
                          style={{ backgroundColor: "#221f1f" }}
                        >
                          {actor}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Additional information */}
                <div className="mt-4">
                  <h3 className="h4 mb-3">Additional Info</h3>
                  <Row>
                    <Col sm={6}>
                      <Card.Text>
                        <span style={{ color: "#e50914" }}>Release Year: </span>
                        {movie.releaseYear || "N/A"}
                      </Card.Text>
                    </Col>
                    <Col sm={6}>
                      <Card.Text>
                        <span style={{ color: "#e50914" }}>Featured: </span>
                        {movie.featured ? "Yes" : "No"}
                      </Card.Text>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Custom Snackbar */}
        <div className={`custom-snackbar ${showSnackbar ? "show" : ""}`}>
          <p className="snackbar-message">{snackbarMessage}</p>
        </div>
      </Container>
    </div>
  );
};

MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      genres: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
        })
      ),
      director: PropTypes.shape({
        name: PropTypes.string.isRequired,
        bio: PropTypes.string,
        birthYear: PropTypes.number,
      }).isRequired,
      imageURL: PropTypes.string,
      featured: PropTypes.bool,
      actors: PropTypes.arrayOf(PropTypes.string),
      rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      releaseYear: PropTypes.number,
    })
  ).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.func.isRequired,
};

export default MovieView;
