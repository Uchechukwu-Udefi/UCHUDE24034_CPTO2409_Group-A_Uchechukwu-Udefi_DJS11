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

// Create Context for global playback state
const PlaybackContext = createContext();

/**
 * Provides global playback state and control functions to the application.
 *
 * Handles:
 * - Playing episodes
 * - Managing history, favorites, and completed episodes
 * - Tracking progress
 * - Persisting data to localStorage
 * - Controlling the audio element
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Components that consume playback context
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
  const [volume, setVolume] = useState(1); // Default volume level

  const audioRef = useRef(null);
  const location = useLocation();

  const isEpisodePlayerPage = /^\/shows\/[^/]+\/season\/[^/]+\/episode\/[^/]+$/.test(location.pathname);

  // Load persisted data from localStorage on mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("playbackHistory")) || [];
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const savedCompleted = JSON.parse(localStorage.getItem("completedEpisodes")) || [];
    const savedProgress = JSON.parse(localStorage.getItem("episodeProgress")) || {};
    const savedCurrentEpisode = JSON.parse(localStorage.getItem("currentEpisode")) || null;

    setHistory(savedHistory);
    setFavorites(savedFavorites);
    setCompletedEpisodes(savedCompleted);
    setProgressMap(savedProgress);
    setCurrentEpisode(savedCurrentEpisode);
  }, []);

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem("playbackHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("completedEpisodes", JSON.stringify(completedEpisodes));
  }, [completedEpisodes]);

  useEffect(() => {
    localStorage.setItem("episodeProgress", JSON.stringify(progressMap));
  }, [progressMap]);

  useEffect(() => {
    localStorage.setItem("currentEpisode", JSON.stringify(currentEpisode));
  }, [currentEpisode]);

  // When current episode changes, load and update the audio source
  useEffect(() => {
    if (currentEpisode?.audioUrl && audioRef.current) {
      const audio = audioRef.current;
      audio.pause();
      audio.src = currentEpisode.audioUrl;
      audio.load();
    }
  }, [currentEpisode]);

  // Track listening progress
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

  // Mark episode as completed when playback finishes
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

  /**
   * Starts playing the specified episode.
   * If it's the same episode, playback is not restarted.
   * Playback resumes from previously saved progress.
   *
   * @param {Object} episode - Episode object to play
   */
  const playShow = (episode) => {
    if (!episode) return;

    const episodeKey = `${episode.showId || episode.id}-${episode.seasonNumber}-${episode.episode}`;
    const enrichedEpisode = { ...episode, _key: episodeKey };

    setCurrentEpisode(enrichedEpisode);

    // Load audio and resume progress after a short delay
    const progress = progressMap[episodeKey] || 0;
    setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const seekAndPlay = () => {
        if (!isNaN(audio.duration)) {
          audio.currentTime = (progress / 100) * audio.duration;
          audio.play().then(() => setIsPlaying(true)).catch(console.error);
        }
      };

      if (audio.readyState >= 1) {
        seekAndPlay();
      } else {
        audio.addEventListener("loadedmetadata", seekAndPlay, { once: true });
      }
    }, 100);

    // Update history
    setHistory((prev) => {
      const filtered = prev.filter((e) => e._key !== episodeKey);
      return [enrichedEpisode, ...filtered].slice(0, 10);
    });
  };

   /**
   * Toggles play/pause of the audio player.
   */
  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  /**
   * Sets the list of episodes for the current season.
   *
   * @param {Array<Object>} episodes - List of episode objects
   */
  const loadSeason = (episodes) => {
    setSeasonEpisodes(episodes);
  };

  /**
   * Toggles an episode as a favorite (add/remove).
   * @param {Object} episode - Episode to toggle
   */
  const toggleFavorite = (episode) => {
    const episodeKey = episode._key || `${episode.showId || episode.id}-${episode.seasonNumber}-${episode.episode}`;
    setFavorites((prev) => {
      const exists = prev.find((fav) => fav._key === episodeKey);
      if (exists) {
        return prev.filter((fav) => fav._key !== episodeKey);
      } else {
        const enriched = {
          ...episode,
          _key: episodeKey,
          addedAt: new Date().toISOString(),
        };
        return [enriched, ...prev];
      }
    });
  };


  /**
   * Removes a favorite by its episode key.
   *
   * @param {string} key - The `_key` of the episode to remove
   */
  const removeFavorite = (key) => {
    setFavorites((prev) => prev.filter((fav) => fav._key !== key));
  };

  /**
   * Resets listening history, completed episodes, and progress.
   * Also clears localStorage entries.
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
   * Sets the volume of the audio player.
   */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const savedVolume = localStorage.getItem("playerVolume");
    if (savedVolume !== null) {
      setVolume(Number(savedVolume));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playerVolume", volume);
  }, [volume]);

  /**
   * Returns the playback context value.
   *
   * @returns {Object} Playback context value
   */
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
 * Custom hook to access the playback context.
 *
 * @returns {Object} Playback context value
 */
export function usePlayback() {
  return useContext(PlaybackContext);
}
