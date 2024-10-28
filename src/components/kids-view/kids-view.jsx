import React, { useState, useMemo } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./kids-view.scss";

export const KidsView = ({ movies, onToggleFavorite }) => {
  // Age categories for kids content
  const AGE_CATEGORIES = {
    LITTLE_KIDS: "2-7",
    OLDER_KIDS: "8-12",
  };

  const [selectedAge, setSelectedAge] = useState(AGE_CATEGORIES.LITTLE_KIDS);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Categories with enhanced metadata
  const categories = [
    {
      id: "adventure",
      title: "Adventure",
      icon: "⭐",
      color: "#FFD700",
      backgroundColor: "#2D2D2D",
    },
    {
      id: "animals",
      title: "Animals",
      icon: "🐾",
      color: "#4CAF50",
      backgroundColor: "#2D2D2D",
    },
    {
      id: "learning",
      title: "Learning",
      icon: "📚",
      color: "#2196F3",
      backgroundColor: "#2D2D2D",
    },
    {
      id: "music",
      title: "Music",
      icon: "🎵",
      color: "#FF4081",
      backgroundColor: "#2D2D2D",
    },
  ];

  // Filter movies suitable for kids based on rating and category
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      // Convert rating to string and check if it's kid-friendly
      const movieRating = String(movie.rating);
      const isKidsFriendly = movieRating === "1" || movieRating === "2";
      const ageAppropriate =
        selectedAge === AGE_CATEGORIES.LITTLE_KIDS
          ? movieRating === "1" // G rated only for little kids
          : isKidsFriendly; // G or PG for older kids

      // Category filtering
      const categoryMatch =
        !selectedCategory ||
        (movie.Genre && movie.Genre.Name.toLowerCase() === selectedCategory);

      return ageAppropriate && categoryMatch;
    });
  }, [movies, selectedAge, selectedCategory]);

  // Convert numeric rating to string representation with emoji
  const getRatingLabel = (rating) => {
    switch (String(rating)) {
      case "1":
        return { label: "G", icon: "👶" };
      case "2":
        return { label: "PG", icon: "🌟" };
      case "3":
        return { label: "PG-13", icon: "🎬" };
      case "4":
        return { label: "R", icon: "🔞" };
      default:
        return { label: "NR", icon: "❓" };
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <Container fluid className="kids-view content-margin-kids">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Row className="mb-5">
          <Col className="text-center">
            <h1 className="kids-header">
              Kids Zone
              <span className="rainbow-icon">🌈</span>
            </h1>
          </Col>
        </Row>
      </motion.div>

      {/* Age Toggle */}
      <Row className="justify-content-center mb-5">
        <Col xs={12} md={8} lg={6} className="age-toggle-container">
          <motion.div
            className="btn-group w-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Button
              className={`age-toggle-btn ${
                selectedAge === AGE_CATEGORIES.LITTLE_KIDS ? "active" : ""
              }`}
              onClick={() => setSelectedAge(AGE_CATEGORIES.LITTLE_KIDS)}
            >
              Little Kids (2-7)
              <span className="emoji-icon">👶</span>
            </Button>
            <Button
              className={`age-toggle-btn ${
                selectedAge === AGE_CATEGORIES.OLDER_KIDS ? "active" : ""
              }`}
              onClick={() => setSelectedAge(AGE_CATEGORIES.OLDER_KIDS)}
            >
              Older Kids (8-12)
              <span className="emoji-icon">✨</span>
            </Button>
          </motion.div>
        </Col>
      </Row>

      {/* Categories */}
      <Row className="mb-5">
        <Col className="category-section">
          <motion.div
            className="d-flex justify-content-center flex-wrap gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Button
                  className={`category-btn ${
                    selectedCategory === category.id ? "active" : ""
                  }`}
                  style={{
                    backgroundColor:
                      selectedCategory === category.id
                        ? category.color
                        : category.backgroundColor,
                  }}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )
                  }
                >
                  <span className="category-icon">{category.icon}</span>
                  {category.title}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </Col>
      </Row>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading-animation"
          >
            <span className="loading-icon">🎬</span>
          </motion.div>
        ) : filteredMovies.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="empty-state"
          >
            <h2 className="empty-title">
              No movies found
              <span className="movie-icon">🎬</span>
            </h2>
            <p className="empty-message">
              Try selecting a different age category or check back later for new
              content. We're always adding new movies for you to enjoy!
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            <Row className="movie-grid">
              {filteredMovies.map((movie) => (
                <Col
                  key={movie._id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-4"
                >
                  <motion.div variants={itemVariants}>
                    <Card className="movie-card">
                      <Link
                        to={`/movies/${movie._id}`}
                        className="text-decoration-none movie-link"
                      >
                        <div className="movie-poster-container">
                          <Card.Img
                            variant="top"
                            src={movie.ImagePath}
                            alt={movie.Title}
                            className="movie-poster"
                          />
                          <div className="movie-poster-overlay">
                            <span className="play-icon">▶️</span>
                          </div>
                        </div>
                      </Link>
                      <Card.Body>
                        <Card.Title className="movie-title">
                          {movie.Title}
                        </Card.Title>
                        <div className="badge-container mb-2">
                          <Badge bg="warning" className="rating-badge">
                            {getRatingLabel(movie.rating).label}
                            <span className="ms-1">
                              {getRatingLabel(movie.rating).icon}
                            </span>
                          </Badge>
                          {movie.Genre && (
                            <Badge bg="info" className="genre-badge">
                              {movie.Genre.Name}
                            </Badge>
                          )}
                        </div>
                        <Card.Text className="movie-description">
                          {movie.Description && movie.Description.length > 100
                            ? `${movie.Description.substring(0, 100)}...`
                            : movie.Description}
                        </Card.Text>
                        <Button
                          variant="outline-warning"
                          className="favorite-btn w-100"
                          onClick={(e) => {
                            e.preventDefault();
                            onToggleFavorite(movie._id);
                          }}
                        >
                          Add to Favorites
                          <span className="ms-2">⭐</span>
                        </Button>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default KidsView;
