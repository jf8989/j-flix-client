import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import defaultPoster from "../../assets/images/default-movie-poster.jpg";

export const MovieCard = ({ movie, onToggleFavorite, isFavorite }) => {
  return (
    <Card className="h-100 bg-dark text-white d-flex flex-column">
      <Card.Img variant="top" src={defaultPoster} alt={movie.title} />
      <Card.Body className="d-flex flex-column">
        <Card.Title className="text-truncate">{movie.title}</Card.Title>
        <Card.Text className="movie-description flex-grow-1 small">
          {movie.description.length > 100
            ? `${movie.description.substring(0, 100)}...`
            : movie.description}
        </Card.Text>
        <div className="mt-auto">
          <Link to={`/movies/${movie._id}`} className="d-grid mb-2">
            <Button variant="outline-light" size="sm">
              Open
            </Button>
          </Link>
          <Button
            variant={isFavorite ? "danger" : "outline-light"}
            onClick={() => onToggleFavorite(movie._id)}
            className="w-100"
            size="sm"
          >
            {isFavorite ? "Remove" : "Add to Favorites"}
          </Button>
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
