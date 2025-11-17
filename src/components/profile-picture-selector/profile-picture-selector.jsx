// src/components/profile-picture-selector/profile-picture-selector.jsx

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./profile-picture-selector.scss";
import { profilePics, getProfilePictureFilename } from "../../utils/profilePictures";

const ProfilePictureSelector = ({ show, onHide, onSelect, currentPicture }) => {
  // Convert currentPicture to filename if it's a path
  const currentFilename = getProfilePictureFilename(currentPicture);
  const [selectedImage, setSelectedImage] = useState(currentFilename);
  const [loadedImages, setLoadedImages] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Handle body scrolling when selector is open
  // Handle mobile viewport height
  useEffect(() => {
    const updateHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    if (show) {
      updateHeight();
      window.addEventListener("resize", updateHeight);
    }

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [show]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (show && e.key === "Escape") {
        onHide();
      }
    };

    if (show) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, onHide]);

  // Load and cache images
  useEffect(() => {
    const loadImages = async () => {
      try {
        const loadedPics = await Promise.all(
          profilePics.map((pic) => {
            return new Promise((resolve) => {
              const img = new Image();
              img.src = pic.path;
              img.onload = () => resolve(pic);
              img.onerror = () => resolve({ ...pic, error: true });
            });
          })
        );
        setLoadedImages(loadedPics.filter((pic) => !pic.error));
      } catch (error) {
        console.error("Error loading profile pictures:", error);
      }
    };

    if (show) {
      loadImages();
    }
  }, [show]);

  // Handle image selection
  const handleImageSelect = useCallback(
    (filename) => {
      setSelectedImage(filename);
      onSelect(filename); // Save just the filename, not the full path
      setTimeout(() => {
        onHide();
      }, 0);
    },
    [onSelect, onHide]
  );

  // Handle touch events for swipe detection
  const handleTouchStart = (e) => {
    // Only start touch if the target is the overlay (not a child element)
    if (e.target === e.currentTarget) {
      e.preventDefault(); // Add this line
      e.stopPropagation(); // Add this line
      setTouchEnd(null);
      setTouchStart(e.targetTouches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (e.target === e.currentTarget && touchStart !== null) {
      e.preventDefault(); // Add this line
      e.stopPropagation(); // Add this line
      setTouchEnd(e.targetTouches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isSwipeDown = distance < -50;

    if (isSwipeDown) {
      setTimeout(() => {
        onHide();
      }, 0);
    }
  };

  // Don't render if not shown
  if (!show) return null;

  // Create the overlay component
  const overlayComponent = (
    <div
      className="profile-selector-overlay"
      onClick={(e) => {
        e.stopPropagation();
        setTimeout(() => {
          onHide();
        }, 0);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="profile-selector-container"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <div className="profile-selector-header">
          <h2>Choose Your Profile Picture</h2>
          <button
            className="close-button"
            onClick={onHide}
            aria-label="Close profile picture selector"
          >
            ×
          </button>
        </div>
        <div className="profile-selector-content">
          <div className="profile-grid">
            {loadedImages.map((pic) => (
              <div
                key={pic.id}
                className={`profile-pic-item ${
                  selectedImage === pic.name ? "selected" : ""
                }`}
                onClick={() => handleImageSelect(pic.name)}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                role="button"
                tabIndex={0}
                aria-label={`Profile picture option ${pic.id}`}
                aria-selected={selectedImage === pic.name}
              >
                <img
                  src={pic.path}
                  alt={`Profile option ${pic.id}`}
                  loading="lazy"
                />
                {selectedImage === pic.name && (
                  <div className="selection-indicator">
                    <span className="checkmark" aria-hidden="true">
                      ✓
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render the overlay into document.body
  return createPortal(overlayComponent, document.body);
};

export default ProfilePictureSelector;
