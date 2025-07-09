import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import GlobalPlayer from "../components/GlobalPlayer.jsx";

// Create Context
const PlaybackContext = createContext();

// Playback Provider
export function PlaybackProvider({ children }) {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState([]);
  const [history, setHistory] = useState([]);
  const audioRef = useRef(null);
  const location = useLocation();

  // 🧠 Determine if we are on the full episode player view
  const isEpisodePlayerPage = /^\/shows\/[^/]+\/season\/[^/]+\/episode\/[^/]+$/.test(location.pathname);

  // 📦 Load history from localStorage on first load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("playbackHistory")) || [];
    setHistory(saved);
  }, []);

  // 💾 Persist history to localStorage when updated
  useEffect(() => {
    localStorage.setItem("playbackHistory", JSON.stringify(history));
  }, [history]);

  // 🔁 Set audio source when currentEpisode changes
  useEffect(() => {
    if (currentEpisode?.audioUrl && audioRef.current) {
      const audio = audioRef.current;
      audio.pause();
      audio.src = currentEpisode.audioUrl;
      audio.load(); // Do not auto-play here to respect autoplay restrictions
    }
  }, [currentEpisode]);

  // ▶️ Play selected episode if it's not already playing
  const playShow = (episode) => {
    if (!episode) return;

    const episodeKey = `${episode.showId || episode.id}-${episode.seasonNumber}-${episode.episode}`;

    // Skip reloading the same episode
    if (episodeKey === currentEpisode?._key) return;

    const enrichedEpisode = {
      ...episode,
      _key: episodeKey,
    };

    setCurrentEpisode(enrichedEpisode);

    // Update playback history
    setHistory((prev) => {
      const filtered = prev.filter((e) => e._key !== episodeKey);
      return [enrichedEpisode, ...filtered].slice(0, 10);
    });
  };

  // Optional: Load entire season’s episodes (for next/prev logic)
  const loadSeason = (episodes) => {
    setSeasonEpisodes(episodes);
  };

  return (
    <PlaybackContext.Provider
      value={{
        currentEpisode,
        setCurrentEpisode,
        playShow,
        audioRef,
        history,
        seasonEpisodes,
        loadSeason,
      }}
    >
      {children}

      {/* Global player visible only outside episode full page */}
      {!isEpisodePlayerPage && <GlobalPlayer />}

      {/* Hidden audio tag that controls playback */}
      <audio ref={audioRef} preload="metadata" />
    </PlaybackContext.Provider>
  );
}

// Hook for easy context access
export function usePlayback() {
  return useContext(PlaybackContext);
}
