// src/components/movie-card/movie-card.jsx
import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import defaultPoster from "../../assets/images/default-movie-poster.jpg";

export const MovieCard = ({ movie, onToggleFavorite, isFavorite }) => {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={defaultPoster} alt={movie.title} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.description}</Card.Text>
        <Link to={`/movies/${movie._id}`}>
          <Button variant="link">Open</Button>
        </Link>
        <Button
          variant={isFavorite ? "danger" : "primary"} // Change color based on favorite status
          onClick={() => onToggleFavorite(movie._id)} // Toggle favorite status
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Button>
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
  isFavorite: PropTypes.bool.isRequired, // This should always be a boolean
};
