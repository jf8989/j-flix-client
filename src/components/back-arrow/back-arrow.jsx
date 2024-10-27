import React from "react";
import { useNavigate } from "react-router-dom";
import "./back-arrow.scss";

export const BackArrow = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <div
      className={`back-arrow ${className}`}
      onClick={() => navigate(-1)}
      role="button"
      aria-label="Go back"
    >
      <i className="bi bi-arrow-left"></i>
    </div>
  );
};
