import { createContext, useContext, useState, useEffect } from "react";

const PlaybackContext = createContext();
PlaybackContext.displayName = "PlaybackContext";

export function PlaybackProvider({ children }) {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("playbackHistory");
      setHistory(saved ? JSON.parse(saved) : []);
    } catch (e) {
      console.warn("Failed to load from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("playbackHistory", JSON.stringify(history));
    } catch (e) {
      console.warn("Failed to save to localStorage", e);
    }
  }, [history]);

  const playShow = (episode) => {
    if (!episode || !episode.id) return;
    setCurrentEpisode(episode);
    setHistory((prev) => {
      const filtered = prev.filter((e) => e.id !== episode.id);
      return [episode, ...filtered].slice(0, 10);
    });
  };

  return (
    <PlaybackContext.Provider value={{ currentEpisode, history, playShow }}>
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  return useContext(PlaybackContext);
}
