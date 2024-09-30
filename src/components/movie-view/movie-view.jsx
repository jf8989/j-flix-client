// src/components/movie-view/movie-view.jsx
import React from "react";
import PropTypes from "prop-types";

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <img
        src={require("../../assets/images/default-movie-poster.jpg")} // test default image logic
        //src={movie.imageURL || require("../../default-movie-poster.jpg")} // Import fallback image from src folder
        alt={movie.title}
        style={{ width: "200px", height: "300px" }}
      />
      <h2>{movie.title}</h2>
      <p>{movie.description}</p>
      <p>
        <strong>Director:</strong> {movie.director.name}
      </p>{" "}
      {/* Access the director's name */}
      <p>
        <strong>Genre:</strong> {movie.genre.name}, description:{" "}
        {movie.genre.description}
      </p>{" "}
      {/* Access genre and description */}
      <button onClick={onBackClick}>Back</button>
    </div>
  );
};

// Update PropTypes validation
MovieView.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    director: PropTypes.shape({
      name: PropTypes.string.isRequired, // Add the name property inside the director object
    }).isRequired,
    genre: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string, // Add the description property inside the genre object
    }).isRequired,
    imageURL: PropTypes.string.isRequired, // Add the imageURL prop validation
  }).isRequired,
  onBackClick: PropTypes.func.isRequired,
};
