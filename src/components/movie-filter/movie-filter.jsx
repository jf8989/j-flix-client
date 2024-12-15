// src/components/movie-filter/movie-filter.jsx
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter as setMoviesFilter } from "../../redux/moviesSlice";
import { setFilter as setSeriesFilter } from "../../redux/seriesSlice";
import { Form, Container } from "react-bootstrap";

export function MovieFilter() {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.movies.filter); // We can use movies filter as the source of truth

  const handleFilterChange = useCallback(
    (e) => {
      const value = e.target.value;
      // Update both filters simultaneously
      dispatch(setMoviesFilter(value));
      dispatch(setSeriesFilter(value));
    },
    [dispatch]
  );

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        // Clear both filters
        dispatch(setMoviesFilter(""));
        dispatch(setSeriesFilter(""));
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [dispatch]);

  return (
    <Container
      className={`mb-4 mt-5 pt-5 ${filter ? "movie-filter-active" : ""}`}
    >
      <Form.Control
        type="text"
        placeholder="Search movies & shows..."
        value={filter}
        onChange={handleFilterChange}
        className="bg-dark text-white"
        style={{ border: "1px solid #ffffff", zIndex: 1050 }}
      />
      <style>
        {`
          @media (max-width: 767px) {
            .movie-filter-active {
              margin-bottom: 7rem !important;
            }
          }
        `}
      </style>
    </Container>
  );
}
