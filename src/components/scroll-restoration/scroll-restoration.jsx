import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Store for scroll positions keyed by pathname
const scrollPositions = new Map();

export const ScrollRestoration = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const prevLocationRef = useRef(location);
  const isRestoringRef = useRef(false);

  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevLocationRef.current?.pathname;

    // Determine if this is a back/forward navigation (POP) or a new navigation (PUSH)
    const isBackOrForward = navigationType === 'POP';

    // Save scroll position of previous path before navigating
    if (prevPath && prevPath !== currentPath) {
      scrollPositions.set(prevPath, window.scrollY);
    }

    if (isBackOrForward && scrollPositions.has(currentPath)) {
      // Restore scroll position when using back/forward buttons
      isRestoringRef.current = true;

      // Use multiple RAF to ensure DOM is fully rendered (especially for complex pages)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const savedPosition = scrollPositions.get(currentPath);
          window.scrollTo({
            top: savedPosition,
            left: 0,
            behavior: 'instant',
          });

          // Clear the restoration flag
          setTimeout(() => {
            isRestoringRef.current = false;
          }, 50);
        });
      });
    } else {
      // Scroll to top for new/forward navigation (PUSH, REPLACE)
      // Use RAF to ensure page is rendered before scrolling
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
      });
    }

    // Save scroll position continuously while on a page
    let scrollTimeout;
    const handleScroll = () => {
      if (!isRestoringRef.current) {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          scrollPositions.set(currentPath, window.scrollY);
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Update previous location
    prevLocationRef.current = location;

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [location, navigationType]);

  return null;
};

export default ScrollRestoration;
