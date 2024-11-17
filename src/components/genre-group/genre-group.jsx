// genre-group.jsx
import React, { useRef, useState, useCallback, useMemo } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "./genre-group.scss";

const GenreCategoryGroup = ({
  title,
  movies,
  onToggleFavorite,
  userFavorites, // Changed from isFavorite to userFavorites
}) => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  // Mouse Events for Desktop only
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = x - startX;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="genre-category-section">
      <div className="genre-header">
        <h2 className="genre-category-title">{title}</h2>
      </div>
      <div className="genre-slider-wrapper">
        <button
          className="scroll-button left"
          onClick={() => scroll("left")}
          aria-label="Scroll left"
        >
          <BsChevronLeft />
        </button>
        <div
          className="genre-movies-grid"
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {movies.map((movie) => {
            const isFav = userFavorites.includes(movie._id); // Determine if movie is favorite

            return (
              <div
                key={movie._id}
                className="genre-movie-card"
                onClick={(e) => {
                  if (!isDragging) {
                    navigate(`/movies/${movie._id}`);
                  }
                }}
              >
                <img
                  src={movie.imageURL}
                  alt={movie.title}
                  className="genre-movie-poster"
                  loading="lazy"
                  draggable="false"
                />
                <div className="genre-card-body">
                  <h5 className="genre-card-title">{movie.title}</h5>
                  <div className="mt-auto">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(movie._id);
                      }}
                      className="favorite-star-icon"
                      role="button"
                    >
                      {isFav ? (
                        <i className="bi bi-star-fill star-filled"></i>
                      ) : (
                        <i className="bi bi-star star-empty"></i>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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

const MoviesByGenre = ({ movies, onToggleFavorite, userFavorites, filter }) => {
  // In MoviesByGenre component, update the grouping logic:

  const groupedMovies = useMemo(() => {
    // Filter movies based on search first
    const filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(filter.toLowerCase())
    );

    // If there's a filter active, show all filtered movies in a single group
    if (filter) {
      return {
        [`Search Results for "${filter}"`]: filteredMovies,
      };
    }

    // Group by primary genre
    const genreMoviesMap = filteredMovies.reduce((acc, movie) => {
      const genreName = movie.primaryGenre;
      if (!acc[genreName]) {
        acc[genreName] = [];
      }
      acc[genreName].push(movie);
      return acc;
    }, {});

    // Sort genres by number of movies (descending) and then alphabetically
    return Object.entries(genreMoviesMap)
      .sort(([genreA, moviesA], [genreB, moviesB]) => {
        const countDiff = moviesB.length - moviesA.length;
        return countDiff !== 0 ? countDiff : genreA.localeCompare(genreB);
      })
      .reduce((acc, [genre, movies]) => {
        acc[genre] = movies;
        return acc;
      }, {});
  }, [movies, filter]);

  // If no movies match the filter, show a simple message
  if (Object.values(groupedMovies).flat().length === 0) {
    return (
      <div className="genre-groups-wrapper">
        <p className="no-results">
          No movies found matching your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="genre-groups-wrapper">
      {Object.entries(groupedMovies).map(([genre, genreMovies], index) => (
        <GenreCategoryGroup
          key={genre}
          title={genre}
          movies={genreMovies}
          onToggleFavorite={onToggleFavorite}
          userFavorites={userFavorites} // Pass userFavorites to GenreCategoryGroup
          style={{ "--animation-order": index }}
        />
      ))}
    </div>
  );
};

export default MoviesByGenre;
