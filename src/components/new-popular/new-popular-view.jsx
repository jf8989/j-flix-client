import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";
import { BackArrow } from "../back-arrow/back-arrow";

export const NewPopularView = ({ user, movies, onToggleFavorite }) => {
  const favoriteMovies = user?.FavoriteMovies || [];

  return (
    <Container fluid className="p-3 content-margin">
      <Row className="align-items-center mb-4">
        <Col xs="auto">
          <BackArrow className="mt-1" />
        </Col>
        <Col>
          <h2 className="text-white mb-0">New & Popular</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          {movies.length > 0 && favoriteMovies.length > 0 ? (
            <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
              {movies
                .filter((movie) => favoriteMovies.includes(movie._id))
                .map((movie) => (
                  <Col key={movie._id}>
                    <MovieCard
                      movie={movie}
                      onToggleFavorite={onToggleFavorite}
                      isFavorite={true}
                    />
                  </Col>
                ))}
            </Row>
          ) : (
            <p className="text-white">No movies in this list yet.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default NewPopularView;
