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

      // Helper function to force scroll
      const forceScroll = (position) => {
        window.scrollTo(0, position);
        document.documentElement.scrollTop = position;
        document.body.scrollTop = position;
      };

      // Main page needs longer restoration window due to TrailerHero and genre groups
      const isMainPage = currentPath === '/';
      const timings = isMainPage
        ? [0, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 1000]
        : [0, 50, 100, 200, 350, 500];

      // Create restoration timers
      const timers = timings.map(delay =>
        setTimeout(() => forceScroll(savedPosition), delay)
      );

      scrollTimersRef.current = timers;
    } else {
      // FORWARD NAVIGATION: Scroll to top
      console.log(`[ScrollRestore] Forward to ${currentPath}, scrolling to top`);

      // Helper function to force scroll to top
      const forceScrollTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      };

      // Immediate scroll
      forceScrollTop();

      // Keep forcing scroll to top during and after transition
      const timers = [
        setTimeout(forceScrollTop, 10),
        setTimeout(forceScrollTop, 50),
        setTimeout(forceScrollTop, 100),
        setTimeout(forceScrollTop, 200),
        setTimeout(forceScrollTop, 350),
        setTimeout(forceScrollTop, 500),
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
