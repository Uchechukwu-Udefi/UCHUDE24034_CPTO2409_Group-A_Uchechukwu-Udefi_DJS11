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
  const [favorites, setFavorites] = useState([]);
  const [completedEpisodes, setCompletedEpisodes] = useState([]);
  const audioRef = useRef(null);
  const location = useLocation();

  const isEpisodePlayerPage = /^\/shows\/[^/]+\/season\/[^/]+\/episode\/[^/]+$/.test(location.pathname);

  // 📦 Load from localStorage on mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("playbackHistory")) || [];
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const savedCompleted = JSON.parse(localStorage.getItem("completedEpisodes")) || [];

    setHistory(savedHistory);
    setFavorites(savedFavorites);
    setCompletedEpisodes(savedCompleted);
  }, []);

  // 💾 Persist state to localStorage when updated
  useEffect(() => {
    localStorage.setItem("playbackHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("completedEpisodes", JSON.stringify(completedEpisodes));
  }, [completedEpisodes]);

  // 🔁 Update audio source when episode changes
  useEffect(() => {
    if (currentEpisode?.audioUrl && audioRef.current) {
      const audio = audioRef.current;
      audio.pause();
      audio.src = currentEpisode.audioUrl;
      audio.load();
    }
  }, [currentEpisode]);

  // ▶️ Play an episode
  const playShow = (episode) => {
    if (!episode) return;

    const episodeKey = `${episode.showId || episode.id}-${episode.seasonNumber}-${episode.episode}`;
    if (episodeKey === currentEpisode?._key) return;

    const enrichedEpisode = {
      ...episode,
      _key: episodeKey,
    };

    setCurrentEpisode(enrichedEpisode);

    setHistory((prev) => {
      const filtered = prev.filter((e) => e._key !== episodeKey);
      return [enrichedEpisode, ...filtered].slice(0, 10);
    });
  };

  // 🧭 Load season data
  const loadSeason = (episodes) => {
    setSeasonEpisodes(episodes);
  };

  // ⭐ Toggle favorite
  const toggleFavorite = (episode) => {
    const episodeKey = episode._key || `${episode.showId || episode.id}-${episode.seasonNumber}-${episode.episode}`;
    const enriched = { ...episode, _key: episodeKey, addedAt: new Date().toISOString() };

    setFavorites((prev) => {
      const exists = prev.some((fav) => fav._key === enriched._key);
      return exists ? prev.filter((fav) => fav._key !== enriched._key) : [enriched, ...prev];
    });
  };

  const removeFavorite = (key) => {
    setFavorites((prev) => prev.filter((fav) => fav._key !== key));
  };

  // ✅ Track when audio finishes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentEpisode?._key && !completedEpisodes.includes(currentEpisode._key)) {
        setCompletedEpisodes((prev) => [...prev, currentEpisode._key]);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentEpisode, completedEpisodes]);

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
        favorites,
        toggleFavorite,
        removeFavorite,
        completedEpisodes,
      }}
    >
      {children}

      {!isEpisodePlayerPage && <GlobalPlayer />}
      <audio ref={audioRef} preload="metadata" />
    </PlaybackContext.Provider>
  );
}

// Custom hook
export function usePlayback() {
  return useContext(PlaybackContext);
}
