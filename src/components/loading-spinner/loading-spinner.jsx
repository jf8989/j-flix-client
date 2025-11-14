import React from "react";
import { Spinner } from "react-bootstrap";
import "./loading-spinner.scss";

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-content">
        <Spinner
          animation="border"
          role="status"
          variant="danger"
          style={{ width: "4rem", height: "4rem" }}
        />
        <span className="loading-text">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
