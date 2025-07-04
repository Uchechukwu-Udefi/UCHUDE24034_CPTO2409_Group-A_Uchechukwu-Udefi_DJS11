// PlaybackContext.js
import { createContext, useContext, useState, useEffect, useRef } from "react";

const PlaybackContext = createContext();

export function PlaybackProvider({ children }) {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [history, setHistory] = useState([]);
  const audioRef = useRef(null);

  // Load playback history from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("playbackHistory")) || [];
    setHistory(saved);
  }, []);

  // Save playback history to localStorage
  useEffect(() => {
    localStorage.setItem("playbackHistory", JSON.stringify(history));
  }, [history]);

  // Play audio when currentEpisode changes
  useEffect(() => {
    if (currentEpisode?.audioUrl && audioRef.current) {
      audioRef.current.src = currentEpisode.audioUrl;
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err =>
          console.warn("Autoplay failed, user gesture required", err)
        );
      }
    }
  }, [currentEpisode]);

  const playShow = (episode) => {
    if (!episode) return;

    // Force re-trigger playback if same episode
    if (episode.id !== currentEpisode?.id) {
      setCurrentEpisode(episode);
    } else {
      setCurrentEpisode(null);
      setTimeout(() => setCurrentEpisode(episode), 50);
    }

    setHistory(prev => {
      const filtered = prev.filter(e => e.id !== episode.id);
      return [episode, ...filtered].slice(0, 10);
    });
  };

  return (
    <PlaybackContext.Provider value={{ currentEpisode, playShow, history }}>
      {children}

      {/* Global audio player */}
      <audio ref={audioRef} controls style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        zIndex: 1000,
        background: "white"
      }} />
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  return useContext(PlaybackContext);
}
