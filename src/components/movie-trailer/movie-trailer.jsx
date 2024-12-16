import React, { useState, useEffect, useRef } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import './movie-trailer.scss';

const MovieTrailer = ({ trailer }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const videoContainerRef = useRef(null); // New ref for the video container
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
      },
      events: {
        onReady: (event) => {
          event.target.setPlaybackQuality('hd720');
          if (isMuted) {
            event.target.mute();
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

  const togglePlayPause = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsPlaying(!isPlaying);
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
    <div className="movie-trailer" ref={containerRef}>
      <div className="trailer-container" ref={videoContainerRef}>
        <div id="movie-trailer-player"></div>
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
  );
};

export default MovieTrailer;