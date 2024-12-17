// trailer-hero.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import './trailer-hero.scss';

const TrailerHero = ({ movies, series }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenOverlay, setShowFullscreenOverlay] = useState(true);
  const [currentQuality, setCurrentQuality] = useState(''); // For displaying current quality
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const isYouTubeScriptLoaded = useRef(false);
  const hideOverlayTimer = useRef(null);

  // Function to select a random movie or series
  const selectRandomMovie = useCallback(() => {
    if ((movies && movies.length > 0) || (series && series.length > 0)) {
      // Combine movies and series
      const allContent = [...(movies || []), ...(series || [])];

      // Filter for items with trailers
      const contentWithTrailers = allContent.filter(item => item.trailer?.key);

      if (contentWithTrailers.length > 0) {
        const randomIndex = Math.floor(Math.random() * contentWithTrailers.length);
        setCurrentMovie(contentWithTrailers[randomIndex]);
      }
    }
  }, [movies, series]);

  // Initialize YouTube Player
  const initializePlayer = useCallback(() => {
    if (!currentMovie?.trailer?.key || !window.YT) return;

    // Debugging Log
    console.log('Initializing YouTube Player for:', currentMovie.title);

    // Destroy existing player if any
    if (playerRef.current) {
      console.log('Destroying existing player.');
      playerRef.current.destroy();
    }

    // Create new YouTube player
    playerRef.current = new window.YT.Player('youtube-player', {
      height: '100%',
      width: '100%',
      videoId: currentMovie.trailer.key,
      playerVars: {
        autoplay: 1,
        controls: 0,
        showinfo: 0,
        modestbranding: 1,
        rel: 0,
        // Removed loop and playlist to prevent infinite looping
        // Removed mute from playerVars to prevent reinitialization on mute toggle
      },
      events: {
        onReady: (event) => {
          console.log('Player ready for:', currentMovie.title);
          event.target.setPlaybackQuality('hd1080'); // Request 1080p

          // Check available qualities before setting
          const availableQualities = event.target.getAvailableQualityLevels();
          console.log('Available Qualities:', availableQualities);
          if (availableQualities.includes('hd1080')) {
            event.target.setPlaybackQuality('hd1080');
            setCurrentQuality('hd1080');
          } else if (availableQualities.includes('hd720')) {
            event.target.setPlaybackQuality('hd720');
            setCurrentQuality('hd720');
          } else if (availableQualities.length > 0) {
            event.target.setPlaybackQuality(availableQualities[0]);
            setCurrentQuality(availableQualities[0]);
          }

          // Handle initial mute state without affecting dependencies
          if (isMuted) {
            event.target.mute();
          } else {
            event.target.unMute();
          }
          event.target.playVideo();
        },
        onStateChange: (event) => {
          console.log('Player state changed:', event.data);
          if (event.data === window.YT.PlayerState.ENDED) {
            console.log('Video ended, selecting new trailer');
            selectRandomMovie();
          }
        },
        onPlaybackQualityChange: (event) => {
          console.log('Quality changed to:', event.data);
          setCurrentQuality(event.data);
        },
        onError: (error) => {
          console.error('YouTube player error:', error);
          selectRandomMovie(); // Attempt to play another trailer on error
        }
      }
    });
  }, [currentMovie, selectRandomMovie]); // Removed isMuted from dependencies

  // Load YouTube IFrame API script
  useEffect(() => {
    if (!window.YT && !isYouTubeScriptLoaded.current) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      isYouTubeScriptLoaded.current = true;

      // Define callback for when API is ready
      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API Ready');
        initializePlayer();
      };
    } else if (window.YT && currentMovie) {
      initializePlayer();
    }

    // Cleanup on unmount
    return () => {
      if (playerRef.current) {
        console.log('Cleaning up player on unmount.');
        playerRef.current.destroy();
      }
    };
  }, [currentMovie, initializePlayer]); // Ensure isMuted is not here

  // Select initial movie on component mount or when movies prop changes
  useEffect(() => {
    selectRandomMovie();
  }, [movies, selectRandomMovie]);

  // Toggle mute state
  const toggleMute = useCallback(() => {
    if (playerRef.current) {
      if (isMuted) {
        console.log('Unmuting trailer.');
        playerRef.current.unMute();
      } else {
        console.log('Muting trailer.');
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Handle volume change via input range
  const handleVolumeChange = useCallback((e) => {
    e.stopPropagation();
    if (playerRef.current) {
      const volume = parseInt(e.target.value, 10);
      playerRef.current.setVolume(volume);
      if (volume === 0) {
        playerRef.current.mute();
        setIsMuted(true);
      } else if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  }, [isMuted]);

  // Handle fullscreen toggle via double-click
  const handleDoubleClick = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) { /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    } else {
      // Enter fullscreen
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) { /* Safari */
        container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) { /* Firefox */
        container.mozRequestFullScreen();
      } else if (container.msRequestFullscreen) { /* IE11 */
        container.msRequestFullscreen();
      }
    }
  }, []);

  // Toggle play/pause on click
  const togglePlayPause = useCallback(() => {
    if (playerRef.current) {
      const playerState = playerRef.current.getPlayerState();
      if (playerState === window.YT.PlayerState.PLAYING) {
        console.log('Pausing trailer.');
        playerRef.current.pauseVideo();
      } else if (playerState === window.YT.PlayerState.PAUSED || playerState === window.YT.PlayerState.CUED) {
        console.log('Resuming trailer.');
        playerRef.current.playVideo();
      }
      // Note: Other states like BUFFERING can be handled if necessary
    }
  }, []);

  // Handle fullscreen change events
  const handleFullscreenChange = useCallback(() => {
    const fsElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    const isFs = !!fsElement;
    setIsFullscreen(isFs);

    if (isFs) {
      setShowFullscreenOverlay(true);
      startHideOverlayTimer();
    } else {
      setShowFullscreenOverlay(false);
      clearHideOverlayTimer();
    }
  }, []);

  // Add event listeners for fullscreen changes
  useEffect(() => {
    const handleChange = () => handleFullscreenChange();

    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    document.addEventListener('mozfullscreenchange', handleChange);
    document.addEventListener('MSFullscreenChange', handleChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
      document.removeEventListener('mozfullscreenchange', handleChange);
      document.removeEventListener('MSFullscreenChange', handleChange);
    };
  }, [handleFullscreenChange]);

  // Functions to manage overlay hiding timer
  const startHideOverlayTimer = useCallback(() => {
    clearHideOverlayTimer();
    hideOverlayTimer.current = setTimeout(() => {
      setShowFullscreenOverlay(false);
      console.log('Hiding overlay and cursor due to inactivity.');
    }, 3000); // 3 seconds of inactivity
  }, []);

  const resetHideOverlayTimer = useCallback(() => {
    if (isFullscreen) {
      setShowFullscreenOverlay(true);
      startHideOverlayTimer();
      console.log('Resetting overlay timer due to mouse movement.');
    }
  }, [isFullscreen, startHideOverlayTimer]);

  const clearHideOverlayTimer = useCallback(() => {
    if (hideOverlayTimer.current) {
      clearTimeout(hideOverlayTimer.current);
      hideOverlayTimer.current = null;
      console.log('Cleared overlay hiding timer.');
    }
  }, []);

  // Handle mouse movement to reset the overlay timer
  useEffect(() => {
    if (isFullscreen) {
      const handleMouseMove = () => {
        resetHideOverlayTimer();
      };

      document.addEventListener('mousemove', handleMouseMove);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        clearHideOverlayTimer();
      };
    }
  }, [isFullscreen, resetHideOverlayTimer, clearHideOverlayTimer]);

  // Derived state to determine if overlay should be visible
  const showOverlay = (!isFullscreen && isHovered) || (isFullscreen && showFullscreenOverlay);

  if (!currentMovie) return null;

  return (
    <div
      className={`trailer-hero ${isFullscreen && !showFullscreenOverlay ? 'hide-cursor' : ''}`}
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
      onClick={togglePlayPause}
      style={{ cursor: 'pointer' }}
    >
      <div className="trailer-container">
        <div id="youtube-player"></div>
        <div className={`trailer-overlay ${showOverlay ? 'hovered' : ''}`}>
          <div className="trailer-content">
            <h1>{currentMovie.title}</h1>
            <p>{currentMovie.description}</p>
            <div className="current-quality">
              Current Quality: {currentQuality.toUpperCase()}
            </div>
          </div>
          <div className="trailer-controls">
            <button
              className="control-button mute-button"
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              aria-label={isMuted ? "Unmute Trailer" : "Mute Trailer"}
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            <div className="volume-control">
              <input
                type="range"
                min="0"
                max="100"
                className="volume-slider"
                onChange={handleVolumeChange}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
                aria-label="Volume"
              />
            </div>

            <button
              className="control-button fullscreen-button-mobile"
              onClick={(e) => {
                e.stopPropagation();
                handleDoubleClick();
              }}
              aria-label="Toggle Fullscreen"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrailerHero;
