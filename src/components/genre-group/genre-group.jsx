import React, { useMemo, useRef, useCallback } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom"; // Add this import
import _ from "lodash";
import "./genre-group.scss";

const GenreCategoryGroup = ({
  title,
  movies,
  onToggleFavorite,
  isFavorite,
}) => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate(); // Add navigation hook

  const scroll = useCallback((direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      const newScrollPosition =
        container.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <div className="genre-category-section">
      <div className="genre-header">
        <h2 className="genre-category-title">{title}</h2>
      </div>
      <div className="genre-slider-container">
        <button
          className="scroll-button left"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <BsChevronLeft />
        </button>
        <div className="genre-movies-grid" ref={scrollContainerRef}>
          {movies.map((movie) => (
            <div
              key={movie._id}
              className="genre-movie-card"
              onClick={() => navigate(`/movies/${movie._id}`)} // Add click handler
              style={{ cursor: "pointer" }} // Add cursor pointer
            >
              <img
                src={movie.imageURL}
                alt={movie.title}
                className="genre-movie-poster"
                loading="lazy"
              />
              <div className="genre-card-body">
                <h5 className="genre-card-title">{movie.title}</h5>
                <div className="mt-auto">
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation when clicking the star
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

const MoviesByGenre = ({ movies, onToggleFavorite, isFavorite, filter }) => {
  const groupedMovies = useMemo(() => {
    // Filter movies based on search first
    const filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(filter.toLowerCase())
    );

    // Group movies by genre
    const grouped = _.groupBy(
      filteredMovies,
      (movie) => movie.genre?.name || "Other"
    );

    // Sort genres by movie count (descending) and alphabetically
    return Object.entries(grouped)
      .sort(([genreA, moviesA], [genreB, moviesB]) => {
        // First sort by number of movies (descending)
        const countDiff = moviesB.length - moviesA.length;
        if (countDiff !== 0) return countDiff;
        // Then alphabetically
        return genreA.localeCompare(genreB);
      })
      .reduce((acc, [genre, movies]) => {
        acc[genre] = movies;
        return acc;
      }, {});
  }, [movies, filter]);

  // If no movies match the filter, show a message
  if (Object.values(groupedMovies).flat().length === 0) {
    return (
      <div className="genre-groups-wrapper">
        <div className="welcome-section">
          <h1>
            Welcome to <span className="highlight">J-Flix</span>
          </h1>
          <p>No movies found matching your search criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="genre-groups-wrapper">
      <div className="welcome-section">
        <h1>
          Welcome to <span className="highlight">J-Flix</span>
        </h1>
        <p>
          Discover movies across different genres. Add your favorites to your
          personal collection.
        </p>
      </div>

      {Object.entries(groupedMovies).map(([genre, genreMovies]) => (
        <GenreCategoryGroup
          key={genre}
          title={genre}
          movies={genreMovies}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite}
        />
      ))}
    </div>
  );
};

export default MoviesByGenre;
