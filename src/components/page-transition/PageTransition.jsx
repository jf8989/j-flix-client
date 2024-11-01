// src/components/page-transition/PageTransition.jsx
import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const transitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
};

const timingPresets = {
  smooth: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3,
  },
  snappy: {
    type: "spring",
    stiffness: 300,
    damping: 30,
    duration: 0.2,
  },
  gentle: {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  },
};

const PageTransition = ({
  children,
  transitionType = "fade",
  timing = "smooth",
  className = "",
}) => {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={transitions[transitionType]}
      transition={timingPresets[timing]}
      className={`page-transition ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
