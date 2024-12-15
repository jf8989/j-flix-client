// src/components/profile-picture-selector/profile-picture-selector.jsx

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import "./profile-picture-selector.scss";

// Import all profile pictures individually
import pic1 from "../../assets/images/profile-pics/1.webp";
import pic2 from "../../assets/images/profile-pics/2.webp";
import pic3 from "../../assets/images/profile-pics/3.webp";
import pic4 from "../../assets/images/profile-pics/4.webp";
import pic5 from "../../assets/images/profile-pics/5.webp";
import pic6 from "../../assets/images/profile-pics/6.webp";
import pic7 from "../../assets/images/profile-pics/7.webp";
import pic8 from "../../assets/images/profile-pics/8.webp";
import pic9 from "../../assets/images/profile-pics/9.webp";
import pic10 from "../../assets/images/profile-pics/10.webp";
import pic11 from "../../assets/images/profile-pics/11.webp";
import pic12 from "../../assets/images/profile-pics/12.webp";
import pic13 from "../../assets/images/profile-pics/13.webp";
import pic14 from "../../assets/images/profile-pics/14.webp";
import pic15 from "../../assets/images/profile-pics/15.webp";
import pic16 from "../../assets/images/profile-pics/16.webp";
import pic17 from "../../assets/images/profile-pics/17.webp";

// Create array of profile pictures with their paths
const profilePics = [
  { id: 1, path: pic1 },
  { id: 2, path: pic2 },
  { id: 3, path: pic3 },
  { id: 4, path: pic4 },
  { id: 5, path: pic5 },
  { id: 6, path: pic6 },
  { id: 7, path: pic7 },
  { id: 8, path: pic8 },
  { id: 9, path: pic9 },
  { id: 10, path: pic10 },
  { id: 11, path: pic11 },
  { id: 12, path: pic12 },
  { id: 13, path: pic13 },
  { id: 14, path: pic14 },
  { id: 15, path: pic15 },
  { id: 16, path: pic16 },
  { id: 17, path: pic17 },
];

const ProfilePictureSelector = ({ show, onHide, onSelect, currentPicture }) => {
  const [selectedImage, setSelectedImage] = useState(currentPicture);
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
    (imagePath) => {
      setSelectedImage(imagePath);
      onSelect(imagePath);
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
                  selectedImage === pic.path ? "selected" : ""
                }`}
                onClick={() => handleImageSelect(pic.path)}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                role="button"
                tabIndex={0}
                aria-label={`Profile picture option ${pic.id}`}
                aria-selected={selectedImage === pic.path}
              >
                <img
                  src={pic.path}
                  alt={`Profile option ${pic.id}`}
                  loading="lazy"
                />
                {selectedImage === pic.path && (
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
