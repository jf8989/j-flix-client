import React, { useState } from "react";
import PropTypes from "prop-types";
import "./movie-image.scss";

const MovieImage = ({ imageURL, title, className = "", style = {} }) => {
  const [imgError, setImgError] = useState(false);

  // Default placeholder dimensions
  const defaultWidth = 300;
  const defaultHeight = 450;

  // Extract dimensions from imageURL if it's a placeholder
  const getDimensions = (url) => {
    if (url?.includes("/api/placeholder/")) {
      const parts = url.split("/");
      return {
        width: parseInt(parts[parts.length - 2]) || defaultWidth,
        height: parseInt(parts[parts.length - 1]) || defaultHeight,
      };
    }
    return { width: defaultWidth, height: defaultHeight };
  };

  const { width, height } = getDimensions(imageURL);
  const fallbackURL = `/api/placeholder/${width}/${height}`;

  return (
    <img
      src={!imgError ? imageURL || fallbackURL : fallbackURL}
      alt={title}
      className={`movie-image ${className}`}
      style={{
        objectFit: "cover",
        minHeight: "200px",
        backgroundColor: "#221f1f",
        ...style,
      }}
      onError={(e) => {
        if (!imgError) {
          setImgError(true);
          e.target.src = fallbackURL;
        }
      }}
    />
  );
};

MovieImage.propTypes = {
  imageURL: PropTypes.string,
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default MovieImage;
