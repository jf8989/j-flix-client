import React from "react";
import PropTypes from "prop-types";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import MovieImage from "../movie-image/movie-image";

export const MovieView = ({ movies, onToggleFavorite, isFavorite }) => {
  const { movieId } = useParams();
  const movie = movies.find((m) => m._id === movieId);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <Container className="movie-view custom-margin-top">
      <Row className="g-4">
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
                  {movie.releaseYear || movie.year || "N/A"}
                </span>
              </div>
              <Button
                onClick={() => onToggleFavorite(movie._id)}
                style={{
                  backgroundColor: isFavorite(movie._id)
                    ? "#e50914"
                    : "#221f1f",
                  borderColor: isFavorite(movie._id) ? "#e50914" : "#221f1f",
                }}
                className="mb-2"
              >
                {isFavorite(movie._id)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </Button>
              <Link to="/" className="d-grid">
                <Button variant="secondary">Back</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="bg-dark text-white h-100">
            <Card.Body>
              <div className="mb-4">
                <Card.Title as="h1" className="display-4 mb-2">
                  {movie.title}
                </Card.Title>
                <Card.Text className="lead">{movie.description}</Card.Text>
              </div>

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

              <div className="mb-4">
                <h3 className="h4 mb-3">Genre</h3>
                <Card.Text>
                  <span style={{ color: "#e50914" }}>Category: </span>
                  {movie.genre.name}
                </Card.Text>
                <Card.Text>
                  <span style={{ color: "#e50914" }}>Description: </span>
                  {movie.genre.description}
                </Card.Text>
              </div>

              <div className="mb-4">
                <h3 className="h4 mb-3">Cast</h3>
                <div className="d-flex flex-wrap gap-2">
                  {movie.actors &&
                    movie.actors.map((actor, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded"
                        style={{
                          backgroundColor: "#221f1f",
                          margin: "0 5px 5px 0",
                        }}
                      >
                        {actor}
                      </span>
                    ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="h4 mb-3">Additional Info</h3>
                <Row>
                  <Col sm={6}>
                    <Card.Text>
                      <span style={{ color: "#e50914" }}>Release Year: </span>
                      {movie.releaseYear || movie.year || "N/A"}
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
    </Container>
  );
};

MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      genre: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
      }).isRequired,
      director: PropTypes.shape({
        name: PropTypes.string.isRequired,
        bio: PropTypes.string,
        birthYear: PropTypes.number,
      }).isRequired,
      imageURL: PropTypes.string,
      featured: PropTypes.bool,
      year: PropTypes.number,
      actors: PropTypes.arrayOf(PropTypes.string),
      rating: PropTypes.string,
      releaseYear: PropTypes.number,
    })
  ).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  isFavorite: PropTypes.func.isRequired,
};

export default MovieView;
