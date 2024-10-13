import React from "react";
import PropTypes from "prop-types";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import defaultPoster from "../../assets/images/default-movie-poster.jpg";

export const MovieView = ({ movies, onToggleFavorite, isFavorite }) => {
  const { movieId } = useParams();
  const movie = movies.find((m) => m._id === movieId);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Card.Img variant="top" src={defaultPoster} alt={movie.title} />
        </Col>
        <Col md={8}>
          <Card className="bg-dark text-white">
            <Card.Body>
              <Card.Title as="h2">{movie.title}</Card.Title>
              <Card.Text>{movie.description}</Card.Text>
              <Card.Text>
                <strong>Director:</strong> {movie.director.name}
              </Card.Text>
              <Card.Text>
                <strong>Genre:</strong> {movie.genre.name}
              </Card.Text>
              <Card.Text>
                <strong>Description:</strong> {movie.genre.description}
              </Card.Text>
              <Button
                onClick={() => onToggleFavorite(movie._id)}
                variant={isFavorite(movie._id) ? "danger" : "primary"}
                className="me-2"
              >
                {isFavorite(movie._id)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </Button>
              <Link to="/">
                <Button variant="secondary">Back</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      director: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      genre: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
      }).isRequired,
      imageURL: PropTypes.string,
    })
  ).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.func.isRequired,
};
