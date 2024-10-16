import React from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Star, StarFill } from "react-bootstrap-icons";
import defaultPoster from "../../assets/images/default-movie-poster.jpg";

export const MovieCard = ({ movie, onToggleFavorite, isFavorite }) => {
  // Function to truncate description to two lines
  const truncateDescription = (text, maxLength = 60) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(" ", maxLength)) + "...";
  };

  return (
    <Card className="h-100 bg-dark text-white d-flex flex-column movie-card">
      <Link to={`/movies/${movie._id}`}>
        <Card.Img variant="top" src={defaultPoster} alt={movie.title} />
      </Link>
      <Card.Body className="d-flex flex-column">
        <Link
          to={`/movies/${movie._id}`}
          className="text-white text-decoration-none"
        >
          <Card.Title className="text-truncate">{movie.title}</Card.Title>
        </Link>
        <Card.Text className="movie-description flex-grow-1 small">
          {truncateDescription(movie.description)}
        </Card.Text>
        <div className="mt-auto d-flex justify-content-end">
          <span
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(movie._id);
            }}
            style={{ cursor: "pointer" }}
          >
            {isFavorite ? (
              <StarFill color="gold" size={24} />
            ) : (
              <Star color="white" size={24} />
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
    imageURL: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.bool.isRequired,
};
