import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { BsStar, BsStarFill } from "react-icons/bs";
import defaultPoster from "../../assets/images/default-movie-poster.jpg";
import { useDispatch } from "react-redux";
import { clearFilter } from "../../redux/moviesSlice";
import "./movie-card.scss";

export const MovieCard = ({ movie, onToggleFavorite, isFavorite }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const truncateDescription = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(" ", maxLength)) + "...";
  };

  const handleMovieClick = (e) => {
    e.preventDefault();
    dispatch(clearFilter());
    navigate(`/movies/${movie._id}`, {
      state: { from: location.pathname },
    });
  };

  return (
    <Card className="h-100 bg-dark text-white d-flex flex-column movie-card">
      <div
        onClick={handleMovieClick}
        style={{ cursor: "pointer", position: "relative" }}
      >
        {/* Badges container */}
        <div className="badges-container">
          {movie.rating && (
            <span className="rating-badge">★ {String(movie.rating)}</span>
          )}
          {(movie.releaseYear || movie.year) && (
            <span className="year-badge">
              {movie.releaseYear || movie.year}
            </span>
          )}
        </div>

        <Card.Img
          variant="top"
          src={movie.imageURL || defaultPoster}
          alt={movie.title}
        />
      </div>
      <Card.Body className="d-flex flex-column p-2">
        <div
          onClick={handleMovieClick}
          className="text-white text-decoration-none"
          style={{ cursor: "pointer" }}
        >
          <Card.Title className="text-truncate mb-1">{movie.title}</Card.Title>
        </div>
        <Card.Text className="movie-description small mb-1">
          {truncateDescription(movie.description)}
        </Card.Text>
        <div className="genre-badges mb-2">
          {movie.genres.map((genre, index) => (
            <span
              key={`${movie._id}-${genre.name}`}
              className={`genre-badge ${
                genre.name === movie.primaryGenre ? "primary" : "secondary"
              }`}
            >
              {genre.name}
            </span>
          ))}
        </div>
        <div className="mt-auto d-flex justify-content-end favorite-icon-container">
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(movie._id);
            }}
            className="movie-favorite-icon"
            style={{
              cursor: "pointer",
              position: "relative",
              zIndex: "5",
            }}
          >
            {isFavorite ? (
              <BsStarFill
                className="star-icon-filled"
                size={20}
                style={{ color: "#FFD700" }}
              />
            ) : (
              <BsStar
                className="star-icon-empty"
                size={20}
                style={{ color: "#ffffff" }}
              />
            )}
          </span>
        </div>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    imageURL: PropTypes.string,
    description: PropTypes.string.isRequired,
    rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    releaseYear: PropTypes.number,
    year: PropTypes.number,
  }).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};

export default MovieCard;
