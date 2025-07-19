import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useLocation } from "react-router-dom";
import GlobalPlayer from "../components/GlobalPlayer.jsx";
import PropTypes from "prop-types";

const PlaybackContext = createContext();

/**
 * Provides global playback state and control functions to the application.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Children components that consume context
 * @returns {JSX.Element}
 */
export function PlaybackProvider({ children }) {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState([]);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [completedEpisodes, setCompletedEpisodes] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);

  const [volume, setVolume] = useState(1);
  const [lastVolume, setLastVolume] = useState(1);

  const audioRef = useRef(null);
  const location = useLocation();

  const isEpisodePlayerPage = /^\/shows\/[^/]+\/season\/[^/]+\/episode\/[^/]+$/.test(location.pathname);

  // Load persisted state
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("playbackHistory")) || [];
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const savedCompleted = JSON.parse(localStorage.getItem("completedEpisodes")) || [];
    const savedProgress = JSON.parse(localStorage.getItem("episodeProgress")) || {};
    const savedCurrentEpisode = JSON.parse(localStorage.getItem("currentEpisode"));
    const savedIsPlaying = JSON.parse(localStorage.getItem("isPlaying"));
    const savedVolume = JSON.parse(localStorage.getItem("playerVolume"));
    const savedLastVolume = JSON.parse(localStorage.getItem("lastVolume"));

    setHistory(savedHistory);
    setFavorites(savedFavorites);
    setCompletedEpisodes(savedCompleted);
    setProgressMap(savedProgress);
    setCurrentEpisode(savedCurrentEpisode);
    setIsPlaying(savedIsPlaying || false);
    if (savedVolume != null) setVolume(savedVolume);
    if (savedLastVolume != null) setLastVolume(savedLastVolume);
  }, []);

  // Persist state
  useEffect(() => localStorage.setItem("playbackHistory", JSON.stringify(history)), [history]);
  useEffect(() => localStorage.setItem("favorites", JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem("completedEpisodes", JSON.stringify(completedEpisodes)), [completedEpisodes]);
  useEffect(() => localStorage.setItem("episodeProgress", JSON.stringify(progressMap)), [progressMap]);
  useEffect(() => localStorage.setItem("currentEpisode", JSON.stringify(currentEpisode)), [currentEpisode]);
  useEffect(() => localStorage.setItem("isPlaying", JSON.stringify(isPlaying)), [isPlaying]);
  useEffect(() => localStorage.setItem("playerVolume", JSON.stringify(volume)), [volume]);
  useEffect(() => localStorage.setItem("lastVolume", JSON.stringify(lastVolume)), [lastVolume]);

  useEffect(() => {
    if (currentEpisode?.audioUrl && audioRef.current) {
      const audio = audioRef.current;
      audio.pause();
      audio.src = currentEpisode.audioUrl;
      audio.load();
    }
  }, [currentEpisode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode?._key) return;

    const handleTimeUpdate = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      if (!isNaN(percent)) {
        setProgressMap((prev) => ({
          ...prev,
          [currentEpisode._key]: Math.min(Math.round(percent), 100),
        }));
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, [currentEpisode]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (currentEpisode?._key && !completedEpisodes.includes(currentEpisode._key)) {
        setCompletedEpisodes((prev) => [...prev, currentEpisode._key]);
      }
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [currentEpisode, completedEpisodes]);

  /**
   * Starts playing the specified episode.
   * @param {Object} episode - Episode to play
   */
  const playShow = (episode) => {
    if (!episode) return;

    const episodeKey = `${episode.showId || episode.id}-${episode.seasonNumber}-${episode.episode}`;
    const enriched = { ...episode, _key: episodeKey };
    setCurrentEpisode(enriched);

    const progress = progressMap[episodeKey] || 0;

    setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const seek = () => {
        if (!isNaN(audio.duration)) {
          audio.currentTime = (progress / 100) * audio.duration;
        }
      };

      if (audio.readyState >= 1) seek();
      else audio.addEventListener("loadedmetadata", seek, { once: true });

      setIsPlaying(false); // resume manually
    }, 100);

    setHistory((prev) => {
      const filtered = prev.filter((e) => e._key !== episodeKey);
      return [enriched, ...filtered].slice(0, 10);
    });
  };

  /**
   * Toggle play/pause.
   */
  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  };

  /**
   * Load season episode list.
   * @param {Array<Object>} episodes
   */
  const loadSeason = (episodes) => {
    setSeasonEpisodes(episodes);
  };

  /**
   * Toggle an episode as favorite.
   * @param {Object} episode
   */
  const toggleFavorite = (episode) => {
    const key = episode._key || `${episode.showId || episode.id}-${episode.seasonNumber}-${episode.episode}`;
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav._key === key);
      if (exists) {
        return prev.filter((f) => f._key !== key);
      } else {
        return [{ ...episode, _key: key, addedAt: new Date().toISOString() }, ...prev];
      }
    });
  };

  /**
   * Remove a favorite by key.
   * @param {string} key
   */
  const removeFavorite = (key) => {
    setFavorites((prev) => prev.filter((fav) => fav._key !== key));
  };

  /**
   * Reset all listening progress and history.
   */
  const resetProgress = () => {
    setHistory([]);
    setCompletedEpisodes([]);
    setProgressMap({});
    localStorage.removeItem("playbackHistory");
    localStorage.removeItem("completedEpisodes");
    localStorage.removeItem("episodeProgress");
  };

  /**
   * Toggle mute/unmute.
   */
  const toggleMute = () => {
    if (volume > 0) {
      setLastVolume(volume);
      setVolume(0);
    } else {
      setVolume(lastVolume || 1);
    }
  };

  /**
   * Sync audio element volume with `volume` state.
   */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <PlaybackContext.Provider
      value={{
        currentEpisode,
        currentEpisodeKey: currentEpisode?._key,
        isPlaying,
        setCurrentEpisode,
        audioRef,
        playShow,
        togglePlayback,
        history,
        progressMap,
        resetProgress,
        seasonEpisodes,
        loadSeason,
        favorites,
        toggleFavorite,
        removeFavorite,
        completedEpisodes,
        volume,
        setVolume,
        lastVolume,
        setLastVolume,
        toggleMute,
      }}
    >
      {children}
      {!isEpisodePlayerPage && <GlobalPlayer />}
      <audio ref={audioRef} preload="metadata" />
    </PlaybackContext.Provider>
  );
}

PlaybackProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook to access playback state and controls.
 * @returns {Object}
 */
export function usePlayback() {
  return useContext(PlaybackContext);
}
