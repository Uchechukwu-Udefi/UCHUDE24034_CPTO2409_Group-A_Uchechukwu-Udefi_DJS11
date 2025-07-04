import { createContext, useContext, useState, useEffect } from "react";

const PlaybackContext = createContext();

export function PlaybackProvider({ children }) {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("playbackHistory")) || [];
    setHistory(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("playbackHistory", JSON.stringify(history));
  }, [history]);

  const playShow = (episode) => {
    setCurrentEpisode(episode);
    if (episode) {
      setHistory((prev) => {
        const filtered = prev.filter((e) => e.id !== episode.id);
        return [episode, ...filtered].slice(0, 10);
      });
    }
  };

  return (
    <PlaybackContext.Provider
      value={{ currentEpisode, playShow, setCurrentEpisode, history }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  return useContext(PlaybackContext);
}
