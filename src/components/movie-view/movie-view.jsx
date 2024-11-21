import React, { useState, useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import MovieImage from "../movie-image/movie-image";
import { BackArrow } from "../back-arrow/back-arrow";
import { useDispatch } from "react-redux";
import { clearFilter } from "../../redux/moviesSlice";
import "./movie-view.scss";

const SimilarMovies = ({
  currentMovie,
  movies,
  onToggleFavorite,
  isFavorite,
}) => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Get similar movies based on first genre match
  const similarMovies = movies.filter(
    (movie) =>
      movie._id !== currentMovie._id &&
      movie.genres[0]?.name === currentMovie.genres[0]?.name
  );

  if (similarMovies.length === 0) return null;

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = x - startX;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="similar-movies-section">
      <div className="genre-header">
        <h3 className="genre-category-title">More Like This</h3>
      </div>
      <div className="genre-slider-wrapper">
        <button
          className="scroll-button left"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <BsChevronLeft />
        </button>
        <div
          className="genre-movies-grid"
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {similarMovies.map((movie) => (
            <div
              key={movie._id}
              className="genre-movie-card"
              onClick={() => {
                if (!isDragging) {
                  navigate(`/movies/${movie._id}`);
                }
              }}
            >
              <img
                src={movie.imageURL}
                alt={movie.title}
                className="genre-movie-poster"
                loading="lazy"
                draggable="false"
              />
              <div className="genre-card-body">
                <h5 className="genre-card-title">{movie.title}</h5>
                <div className="mt-auto">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(movie._id);
                    }}
                    className="favorite-star-icon"
                    role="button"
                  >
                    {isFavorite(movie._id) ? (
                      <i className="bi bi-star-fill star-filled"></i>
                    ) : (
                      <i className="bi bi-star star-empty"></i>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          className="scroll-button right"
          onClick={() => scroll("right")}
          aria-label="Scroll right"
        >
          <BsChevronRight />
        </button>
      </div>
    </div>
  );
};

export const MovieView = ({ movies, onToggleFavorite, isFavorite }) => {
  const { movieId } = useParams();
  const navigate = useNavigate();
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

  // This will be the return statement for MovieView component
  return (
    <div className="movie-view">
      <Container className="custom-margin-top">
        {/* Header Row with Title */}
        <Row className="align-items-center mb-4">
          <Col xs="auto">
            <BackArrow className="mt-1" />
          </Col>
          <Col>
            <h2 className="text-white mb-0">{movie.title}</h2>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Left Column: Image and Favorite Button */}
          <Col md={4}>
            <Card className="bg-dark text-white h-100">
              <MovieImage
                imageURL={movie.imageURL}
                title={movie.title}
                className="w-full h-auto"
              />
              <Card.Body className="d-flex flex-column">
                {/* Rating and Year Info - Conditional Rendering */}
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
                  {movie.releaseYear ? (
                    // Movie year display
                    <span
                      className="px-2 py-1 rounded"
                      style={{
                        backgroundColor: "#221f1f",
                        display: "inline-block",
                      }}
                    >
                      {movie.releaseYear}
                    </span>
                  ) : (
                    // Series year range and status
                    <>
                      <span
                        className="px-2 py-1 rounded"
                        style={{
                          backgroundColor: "#221f1f",
                          display: "inline-block",
                        }}
                      >
                        {movie.firstAirYear}-{movie.lastAirYear || "Present"}
                      </span>
                      <span
                        className="ms-2 px-2 py-1 rounded"
                        style={{
                          backgroundColor: "#221f1f",
                          display: "inline-block",
                        }}
                      >
                        {movie.status}
                      </span>
                    </>
                  )}
                </div>
                {/* Favorite Button */}
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

          {/* Right Column: Content Details */}
          <Col md={8}>
            <Card className="bg-dark text-white h-100">
              <Card.Body>
                {/* Description */}
                <div className="mb-4">
                  <Card.Text className="lead">{movie.description}</Card.Text>
                </div>

                {/* Director/Creator Information - Conditional Rendering */}
                <div className="mb-4">
                  {movie.director ? (
                    // Movie Director Info
                    <>
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
                    </>
                  ) : (
                    // Series Creator Info
                    <>
                      <h3 className="h4 mb-3">Creator</h3>
                      <Card.Text>
                        <span style={{ color: "#e50914" }}>Name: </span>
                        {movie.creator.name}
                      </Card.Text>
                      {movie.creator.bio && (
                        <Card.Text>
                          <span style={{ color: "#e50914" }}>Bio: </span>
                          {movie.creator.bio}
                        </Card.Text>
                      )}
                    </>
                  )}
                </div>

                {/* Genres */}
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

                {/* Cast */}
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

                {/* Additional Information - Conditional Rendering */}
                <div className="mt-4">
                  <h3 className="h4 mb-3">Additional Info</h3>
                  <Row>
                    {movie.releaseYear ? (
                      // Movie Information
                      <>
                        <Col sm={6}>
                          <Card.Text>
                            <span style={{ color: "#e50914" }}>
                              Release Year:{" "}
                            </span>
                            {movie.releaseYear}
                          </Card.Text>
                        </Col>
                        <Col sm={6}>
                          <Card.Text>
                            <span style={{ color: "#e50914" }}>Featured: </span>
                            {movie.featured ? "Yes" : "No"}
                          </Card.Text>
                        </Col>
                      </>
                    ) : (
                      // Series Information
                      <>
                        <Col sm={6}>
                          <Card.Text>
                            <span style={{ color: "#e50914" }}>
                              First Air Year:{" "}
                            </span>
                            {movie.firstAirYear}
                          </Card.Text>
                        </Col>
                        <Col sm={6}>
                          <Card.Text>
                            <span style={{ color: "#e50914" }}>
                              Last Air Year:{" "}
                            </span>
                            {movie.lastAirYear || "Present"}
                          </Card.Text>
                        </Col>
                        <Col sm={6}>
                          <Card.Text>
                            <span style={{ color: "#e50914" }}>
                              Number of Seasons:{" "}
                            </span>
                            {movie.numberOfSeasons}
                          </Card.Text>
                        </Col>
                        <Col sm={6}>
                          <Card.Text>
                            <span style={{ color: "#e50914" }}>Status: </span>
                            {movie.status}
                          </Card.Text>
                        </Col>
                        <Col sm={6}>
                          <Card.Text>
                            <span style={{ color: "#e50914" }}>Featured: </span>
                            {movie.featured ? "Yes" : "No"}
                          </Card.Text>
                        </Col>
                      </>
                    )}
                  </Row>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Similar Content Section */}
        <SimilarMovies
          currentMovie={movie}
          movies={movies}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />

        {/* Snackbar for Favorites */}
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
      }),
      creator: PropTypes.shape({
        // Add creator for series
        name: PropTypes.string.isRequired,
        bio: PropTypes.string,
      }),
      imageURL: PropTypes.string,
      featured: PropTypes.bool,
      actors: PropTypes.arrayOf(PropTypes.string),
      rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      releaseYear: PropTypes.number,
      firstAirYear: PropTypes.number, // Add series-specific fields
      lastAirYear: PropTypes.number,
      numberOfSeasons: PropTypes.number,
    })
  ).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.func.isRequired,
};

export default MovieView;
