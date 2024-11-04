import React, { useMemo, useRef, useCallback } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import _ from "lodash";
import "./genre-group.scss";

const GenreCategoryGroup = ({
  title,
  movies,
  onToggleFavorite,
  isFavorite,
}) => {
  const scrollContainerRef = useRef(null);

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
            <div key={movie._id} className="genre-movie-card">
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
                      e.stopPropagation();
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
    // Group movies by genre and ensure each movie has at least 3 items
    const grouped = _.groupBy(
      movies.filter((movie) =>
        movie.title.toLowerCase().includes(filter.toLowerCase())
      ),
      "genre.name"
    );

    // Only return genres with 3 or more movies
    return Object.fromEntries(
      Object.entries(grouped).filter(([_, movies]) => movies.length >= 3)
    );
  }, [movies, filter]);

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

      {Object.entries(groupedMovies)
        .sort(([genreA], [genreB]) => genreA.localeCompare(genreB))
        .map(([genre, movies]) => (
          <GenreCategoryGroup
            key={genre}
            title={genre || "Uncategorized"}
            movies={movies}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite}
          />
        ))}
    </div>
  );
};

export default MoviesByGenre;
