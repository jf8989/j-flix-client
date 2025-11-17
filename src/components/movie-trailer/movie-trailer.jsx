import React, { useState, useEffect, useRef } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import './movie-trailer.scss';

const MovieTrailer = ({ trailer }) => {
  const [isMuted, setIsMuted] = useState(false); // Start unmuted
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [volume, setVolume] = useState(50); // Track volume state
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const videoContainerRef = useRef(null);
  const isYouTubeScriptLoaded = useRef(false);

  // Initialize YouTube Player
  const initializePlayer = () => {
    if (!trailer?.key || !window.YT) return;

    playerRef.current = new window.YT.Player('movie-trailer-player', {
      height: '100%',
      width: '100%',
      videoId: trailer.key,
      playerVars: {
        autoplay: 1,
        controls: 0,
        showinfo: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3, // Hide annotations
        fs: 1, // Show fullscreen button
        disablekb: 0, // Enable keyboard controls
        playsinline: 1, // Play inline on mobile
      },
      events: {
        onReady: (event) => {
          event.target.setPlaybackQuality('hd1080');
          // Start at 50% volume
          event.target.setVolume(50);
          if (!isMuted) {
            event.target.unMute();
          }
          event.target.playVideo();
        },
        onError: (error) => {
          console.error('YouTube player error:', error);
        }
      }
    });
  };

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT && !isYouTubeScriptLoaded.current) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      isYouTubeScriptLoaded.current = true;

      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else if (window.YT && trailer) {
      initializePlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [trailer]);

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const togglePlayPause = (e) => {
    // Only toggle if clicking on the video itself, not on controls
    if (e && e.target.closest('.trailer-controls')) {
      return;
    }

    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    if (playerRef.current) {
      const newVolume = parseInt(e.target.value, 10);
      setVolume(newVolume);
      playerRef.current.setVolume(newVolume);

      // Auto unmute if volume is raised from 0
      if (newVolume === 0) {
        playerRef.current.mute();
        setIsMuted(true);
      } else if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const handleFullscreen = () => {
    const videoContainer = videoContainerRef.current;
    if (!videoContainer) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      videoContainer.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  // Handle fullscreen changes from other sources (like Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!trailer?.key) return null;

  return (
    <div
      className="movie-trailer"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={togglePlayPause}
      style={{ cursor: 'pointer' }}
    >
      <div className="trailer-container" ref={videoContainerRef}>
        <div id="movie-trailer-player"></div>
        <div className={`trailer-overlay ${isHovered ? 'hovered' : ''}`}>
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
                value={volume}
                className="volume-slider"
                onChange={handleVolumeChange}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
                aria-label="Volume"
              />
            </div>
            <button
              className="control-button fullscreen-button"
              onClick={(e) => {
                e.stopPropagation();
                handleFullscreen();
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
};

export default MovieTrailer;