// trailer-hero.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import './trailer-hero.scss';

const TrailerHero = ({ movies }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [currentMovie, setCurrentMovie] = useState(null);
  const playerRef = useRef(null);
  const videoLoaded = useRef(false);

  const selectRandomMovie = useCallback(() => {
    if (movies && movies.length > 0) {
      const moviesWithTrailers = movies.filter(movie => movie.trailer?.key);
      if (moviesWithTrailers.length > 0) {
        const randomIndex = Math.floor(Math.random() * moviesWithTrailers.length);
        setCurrentMovie(moviesWithTrailers[randomIndex]);
      }
    }
  }, [movies]);

  useEffect(() => {
    selectRandomMovie();
  }, [movies, selectRandomMovie]);

  useEffect(() => {
    if (currentMovie?.trailer?.key && !videoLoaded.current) {
      // Create YouTube player
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player('youtube-player', {
          height: '100%',
          width: '100%',
          videoId: currentMovie.trailer.key,
          playerVars: {
            autoplay: 1,
            controls: 0,
            mute: 1,
            showinfo: 0,
            modestbranding: 1,
            loop: 1,
            playlist: currentMovie.trailer.key,
            rel: 0
          },
          events: {
            onReady: (event) => {
              event.target.playVideo();
              videoLoaded.current = true;
            }
          }
        });
      };
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        videoLoaded.current = false;
      }
    };
  }, [currentMovie]);

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

  if (!currentMovie) return null;

  return (
    <div className="trailer-hero">
      <div className="trailer-container">
        <div id="youtube-player"></div>
        <div className="trailer-overlay">
          <div className="trailer-content">
            <h1>{currentMovie.title}</h1>
            <p>{currentMovie.description}</p>
          </div>
          <button className="mute-button" onClick={toggleMute}>
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrailerHero;