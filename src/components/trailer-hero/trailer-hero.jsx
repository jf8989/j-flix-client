// trailer-hero.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import './trailer-hero.scss';

const TrailerHero = ({ movies }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const isYouTubeScriptLoaded = useRef(false);

  // Function to select a random movie
  const selectRandomMovie = useCallback(() => {
    if (movies && movies.length > 0) {
      const moviesWithTrailers = movies.filter(movie => movie.trailer?.key);
      if (moviesWithTrailers.length > 0) {
        const randomIndex = Math.floor(Math.random() * moviesWithTrailers.length);
        setCurrentMovie(moviesWithTrailers[randomIndex]);
      }
    }
  }, [movies]);

  // Initialize player when currentMovie changes
  const initializePlayer = useCallback(() => {
    if (!currentMovie?.trailer?.key || !window.YT) return;

    // Destroy existing player if any
    if (playerRef.current) {
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
          console.log('Player ready');
          event.target.setPlaybackQuality('hd1080'); // Request 1080p
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
        },
        onError: (error) => {
          console.error('YouTube player error:', error);
          selectRandomMovie(); // Attempt to play another trailer on error
        }
      }
    });
  }, [currentMovie, selectRandomMovie, isMuted]);

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
        playerRef.current.destroy();
      }
    };
  }, [currentMovie, initializePlayer]);

  // Select initial movie on component mount or when movies prop changes
  useEffect(() => {
    selectRandomMovie();
  }, [movies, selectRandomMovie]);

  // Toggle mute state
  const toggleMute = useCallback(() => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Handle fullscreen toggle via double-click
  const handleDoubleClick = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      container.requestFullscreen();
    }
  }, []);

  if (!currentMovie) return null;

  return (
    <div 
      className="trailer-hero" 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
    >
      <div className="trailer-container">
        <div id="youtube-player"></div>
        <div className={`trailer-overlay ${isHovered ? 'hovered' : ''}`}>
          <div className="trailer-content">
            <h1>{currentMovie.title}</h1>
            <p>{currentMovie.description}</p>
          </div>
          <div className="trailer-controls">
            <button className="control-button mute-button" onClick={toggleMute}>
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            {/* Fullscreen button removed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailerHero;
