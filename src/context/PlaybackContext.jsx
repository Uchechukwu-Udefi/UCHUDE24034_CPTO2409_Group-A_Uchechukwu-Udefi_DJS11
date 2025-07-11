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
  const [progressMap, setProgressMap] = useState({}); // { episodeKey: percentage }
  const audioRef = useRef(null);
  const location = useLocation();

  const isEpisodePlayerPage = /^\/shows\/[^/]+\/season\/[^/]+\/episode\/[^/]+$/.test(location.pathname);

  // Load persisted data from localStorage on mount
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("playbackHistory")) || [];
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const savedCompleted = JSON.parse(localStorage.getItem("completedEpisodes")) || [];
    const savedProgress = JSON.parse(localStorage.getItem("episodeProgress")) || {};

    setHistory(savedHistory);
    setFavorites(savedFavorites);
    setCompletedEpisodes(savedCompleted);
    setProgressMap(savedProgress);
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

  // When current episode changes, load and update the audio source
  useEffect(() => {
    if (currentEpisode?.audioUrl && audioRef.current) {
      const audio = audioRef.current;
      audio.pause();
      audio.src = currentEpisode.audioUrl;
      audio.load();
    }
  }, [currentEpisode]);

  // Track and update episode progress during playback
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
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
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
   * Starts playback for a given episode.
   * Adds the episode to history unless it's already the current one.
   *
   * @param {Object} episode - Episode object
   */
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

  /**
   * Sets the list of episodes for the current season.
   *
   * @param {Array<Object>} episodes - List of episode objects
   */
  const loadSeason = (episodes) => {
    setSeasonEpisodes(episodes);
  };

  /**
   * Toggles an episode as favorite. Adds or removes it from favorites.
   *
   * @param {Object} episode - Episode to toggle
   */
  const toggleFavorite = (episode) => {
    const episodeKey = episode._key || `${episode.showId || episode.id}-${episode.seasonNumber}-${episode.episode}`;

    setFavorites((prev) => {
      const exists = prev.find((fav) => fav._key === episodeKey);

      if (exists) {
        // Remove from favorites
        return prev.filter((fav) => fav._key !== episodeKey);
      } else {
        // Add to favorites
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
        progressMap,
        resetProgress,
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
