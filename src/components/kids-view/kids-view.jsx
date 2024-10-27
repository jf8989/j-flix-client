import React, { useState, useMemo } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./kids-view.scss";

export const KidsView = ({ movies, onToggleFavorite }) => {
  // Age categories for kids content
  const AGE_CATEGORIES = {
    LITTLE_KIDS: "2-7",
    OLDER_KIDS: "8-12",
  };

  const [selectedAge, setSelectedAge] = useState(AGE_CATEGORIES.LITTLE_KIDS);

  // Filter movies suitable for kids based on rating
  const kidsMovies = useMemo(() => {
    return movies.filter((movie) => {
      // Convert rating to string and check if it's kid-friendly
      const movieRating = String(movie.rating);
      const isKidsFriendly = movieRating === "1" || movieRating === "2";

      if (selectedAge === AGE_CATEGORIES.LITTLE_KIDS) {
        return isKidsFriendly && movieRating === "1"; // G rated
      } else {
        return isKidsFriendly; // G or PG rated
      }
    });
  }, [movies, selectedAge]);

  // Categories for kids content
  const categories = [
    { title: "Adventure", icon: "🌟" },
    { title: "Animals", icon: "🐾" },
    { title: "Learning", icon: "📚" },
    { title: "Music", icon: "🎵" },
  ];

  // Convert numeric rating to string representation
  const getRatingLabel = (rating) => {
    switch (String(rating)) {
      case "1":
        return "G";
      case "2":
        return "PG";
      case "3":
        return "PG-13";
      case "4":
        return "R";
      default:
        return "NR";
    }
  };

  return (
    <Container fluid className="kids-view content-margin-kids">
      {/* Header Section */}
      <Row className="mb-4">
        <Col>
          <h1
            className="display-4 text-center mb-4"
            style={{ color: "#FFD700" }}
          >
            Kids Zone 🌈
          </h1>
        </Col>
      </Row>

      {/* Age Toggle Section */}
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={6} className="text-center">
          <div className="btn-group">
            <Button
              variant={
                selectedAge === AGE_CATEGORIES.LITTLE_KIDS
                  ? "warning"
                  : "outline-warning"
              }
              onClick={() => setSelectedAge(AGE_CATEGORIES.LITTLE_KIDS)}
              className="px-4 py-2"
            >
              Little Kids (2-7)
            </Button>
            <Button
              variant={
                selectedAge === AGE_CATEGORIES.OLDER_KIDS
                  ? "warning"
                  : "outline-warning"
              }
              onClick={() => setSelectedAge(AGE_CATEGORIES.OLDER_KIDS)}
              className="px-4 py-2"
            >
              Older Kids (8-12)
            </Button>
          </div>
        </Col>
      </Row>

      {/* Categories Section */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.title}
                variant="primary"
                className="rounded-pill px-4 py-2"
                style={{ backgroundColor: "#FF4081", border: "none" }}
              >
                {category.icon} {category.title}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Movies Grid */}
      <Row>
        {kidsMovies.map((movie) => (
          <Col key={movie._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card
              className="h-100 movie-card"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "15px",
                overflow: "hidden",
                border: "none",
              }}
            >
              <Link
                to={`/movies/${movie._id}`}
                className="text-decoration-none"
              >
                <Card.Img
                  variant="top"
                  src={movie.ImagePath}
                  alt={movie.Title}
                  className="movie-poster"
                  style={{ height: "300px", objectFit: "cover" }}
                />
              </Link>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-white mb-2">
                  {movie.Title}
                </Card.Title>
                <div className="mb-2">
                  <Badge bg="warning" text="dark" className="me-2">
                    {getRatingLabel(movie.rating)}
                  </Badge>
                  <Badge bg="info" className="me-1">
                    {movie.Genre?.Name || "Genre N/A"}
                  </Badge>
                </div>
                <Card.Text className="text-white-50 small mb-3">
                  {movie.Description?.slice(0, 100)}...
                </Card.Text>
                <Button
                  variant="outline-warning"
                  className="mt-auto w-100"
                  onClick={() => onToggleFavorite(movie._id)}
                >
                  Add to Favorites ⭐
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {kidsMovies.length === 0 && (
        <Row className="justify-content-center my-5">
          <Col xs={12} className="text-center">
            <h3 className="text-warning mb-3">No movies found! 🎬</h3>
            <p className="text-white-50">
              Try selecting a different age category or check back later for new
              content.
            </p>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default KidsView;
