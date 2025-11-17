import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import "./PageTransition.scss";

const transitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
  slideUp: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.97 },
  },
};

const timingPresets = {
  smooth: {
    type: "tween",
    ease: [0.4, 0, 0.2, 1], // Stunning-UI: Custom cubic-bezier for smoothness
    duration: 0.3, // Increased from 0.2 for smoother feel
  },
  snappy: {
    type: "spring",
    stiffness: 260,
    damping: 26,
    mass: 0.8,
  },
  gentle: {
    type: "tween",
    ease: [0.25, 0.1, 0.25, 1], // Smooth ease-in-out
    duration: 0.4,
  },
};

const PageTransition = ({
  children,
  transitionType = "slideUp", // Changed from fade to slideUp for more engaging transitions
  timing = "smooth",
  className = "",
}) => {
  const location = useLocation();

  // Note: Scroll restoration is handled by the ScrollRestoration component
  // in main-view.jsx to avoid conflicts

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={transitions[transitionType]}
      transition={timingPresets[timing]}
      className={`page-transition ${className}`}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
