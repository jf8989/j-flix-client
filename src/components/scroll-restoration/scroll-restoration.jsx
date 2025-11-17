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

    // Clear any existing scroll timers from previous navigation
    scrollTimersRef.current.forEach(timer => clearTimeout(timer));
    scrollTimersRef.current = [];

    // Determine navigation type
    const isBackNavigation = navigationType === 'POP';

    if (isBackNavigation && scrollPositions.has(currentPath)) {
      // BACK NAVIGATION: Restore the saved scroll position
      const savedPosition = scrollPositions.get(currentPath);

      console.log(`[ScrollRestore] Back to ${currentPath}, restoring to ${savedPosition}px`);

      // DON'T scroll to top first for back navigation
      // Restore immediately and repeatedly to ensure it works
      const timers = [
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
          document.documentElement.scrollTop = savedPosition;
          document.body.scrollTop = savedPosition;
        }, 0),
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
          document.documentElement.scrollTop = savedPosition;
          document.body.scrollTop = savedPosition;
        }, 50),
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
          document.documentElement.scrollTop = savedPosition;
          document.body.scrollTop = savedPosition;
        }, 100),
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
          document.documentElement.scrollTop = savedPosition;
          document.body.scrollTop = savedPosition;
        }, 200),
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
          document.documentElement.scrollTop = savedPosition;
          document.body.scrollTop = savedPosition;
        }, 350),
        setTimeout(() => {
          window.scrollTo(0, savedPosition);
          document.documentElement.scrollTop = savedPosition;
          document.body.scrollTop = savedPosition;
        }, 500),
      ];
      scrollTimersRef.current = timers;
    } else {
      // FORWARD NAVIGATION: Scroll to top
      console.log(`[ScrollRestore] Forward to ${currentPath}, scrolling to top`);

      // Scroll to top immediately and repeatedly
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

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
        const scrollY = window.scrollY;
        scrollPositions.set(currentPath, scrollY);
        console.log(`[ScrollRestore] Saved ${currentPath} at ${scrollY}px`);
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
