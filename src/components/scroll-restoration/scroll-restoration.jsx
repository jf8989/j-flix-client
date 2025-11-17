import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Store for scroll positions keyed by pathname
const scrollPositions = new Map();

export const ScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevLocationRef = useRef(null);
  const scrollTimersRef = useRef([]);

  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevLocationRef.current;

    // Clear any existing scroll timers
    scrollTimersRef.current.forEach(timer => clearTimeout(timer));
    scrollTimersRef.current = [];

    // Save the previous page's scroll position when navigating away
    if (prevPath && prevPath !== currentPath) {
      const currentScroll = window.scrollY;
      scrollPositions.set(prevPath, currentScroll);
    }

    // Determine navigation type
    const isBackNavigation = navigationType === 'POP';

    if (isBackNavigation && scrollPositions.has(currentPath)) {
      // Restore scroll position for back navigation
      const savedPosition = scrollPositions.get(currentPath);

      // Scroll immediately to top first
      window.scrollTo(0, 0);

      // Then restore after transition completes
      const timers = [
        setTimeout(() => window.scrollTo(0, savedPosition), 100),
        setTimeout(() => window.scrollTo(0, savedPosition), 350),
        setTimeout(() => window.scrollTo(0, savedPosition), 400),
      ];
      scrollTimersRef.current = timers;
    } else {
      // Scroll to top for forward navigation - VERY AGGRESSIVE
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Keep forcing scroll to top during and after transition
      const timers = [
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 10),
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 50),
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 100),
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 200),
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 350),
        setTimeout(() => {
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        }, 500),
      ];
      scrollTimersRef.current = timers;
    }

    // Update previous path reference
    prevLocationRef.current = currentPath;

    // Continuously save scroll position while on this page
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollPositions.set(currentPath, window.scrollY);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
      scrollTimersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, [location.pathname, navigationType]);

  return null;
};

export default ScrollRestoration;
