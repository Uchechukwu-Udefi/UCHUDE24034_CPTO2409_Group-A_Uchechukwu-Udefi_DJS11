import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import GlobalPlayer from "../components/GlobalPlayer.jsx";

const PlaybackContext = createContext();

export function PlaybackProvider({ children }) {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [history, setHistory] = useState([]);
  const audioRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("playbackHistory")) || [];
    setHistory(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("playbackHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (currentEpisode?.audioUrl && audioRef.current) {
      const audio = audioRef.current;
      const wasPlaying = !audio.paused && !audio.ended;

      audio.pause();
      audio.src = currentEpisode.audioUrl;
      audio.load();

      const tryResume = () => {
        if (wasPlaying) {
          audio.play().catch(err => console.warn("Playback resume failed:", err));
        }
      };

      audio.addEventListener('loadedmetadata', tryResume, { once: true });

      return () => {
        audio.removeEventListener('loadedmetadata', tryResume);
      };
    }
  }, [currentEpisode]);

  const playShow = (episode) => {
  if (!episode) return;

  const episodeKey = `${episode.showId || episode.id}-${episode.seasonNumber}-${episode.episode}`;

  const enrichedEpisode = {
    ...episode,
    _key: episodeKey, // internal key for uniqueness
  };

  if (episodeKey !== currentEpisode?._key) {
    setCurrentEpisode(enrichedEpisode);
  } else {
    setCurrentEpisode(null);
    setTimeout(() => setCurrentEpisode(enrichedEpisode), 50);
  }

  setHistory(prev => {
    const filtered = prev.filter(e => e._key !== episodeKey);
    return [enrichedEpisode, ...filtered].slice(0, 10);
  });
};

  return (
    <PlaybackContext.Provider value={{ currentEpisode, playShow, history, audioRef }}>
      {children}
      <GlobalPlayer />
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  return useContext(PlaybackContext);
}
