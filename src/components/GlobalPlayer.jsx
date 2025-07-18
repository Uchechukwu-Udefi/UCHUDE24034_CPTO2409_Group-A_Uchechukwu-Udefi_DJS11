import { useEffect, useState } from "react";
import { usePlayback } from "../context/PlaybackContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegWindowClose } from "react-icons/fa";
import ConfirmModal from "./ConfirmModal";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

/**
 * GlobalPlayer component displays a mini audio player that syncs with global playback state.
 */
export default function GlobalPlayer() {
  const {
    currentEpisode,
    setCurrentEpisode,
    audioRef,
    isPlaying,
    togglePlayback,
    volume,
    setVolume,
    toggleMute,
    setLastVolume
  } = usePlayback();

  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const isEpisodePage = /\/shows\/[^/]+\/season\/[^/]+\/episode\/[^/]+/.test(location.pathname);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [audioRef]);

  // Hide GlobalPlayer on full episode pages or if nothing is playing
  if (isEpisodePage || !currentEpisode) return null;

  const confirmClosePlayer = () => {
    setShowConfirm(false);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (typeof setCurrentEpisode === "function") {
      setCurrentEpisode(null);
    }
  };

  const seek = (e) => {
    const audio = audioRef.current;
    const percent = e.target.value;
    if (audio?.duration) {
      audio.currentTime = (audio.duration * percent) / 100;
    }
  };

  const formattedTime = (s) =>
    isNaN(s) ? "--:--" : new Date(s * 1000).toISOString().substr(14, 5);

  const duration = audioRef.current?.duration || 0;

  return (
    <div className={`global-player ${isExpanded ? "expanded" : ""}`}>
      <div className="global-player__header">
        <img
          src={currentEpisode.seasonImage}
          alt=""
          className="global-player__thumbnail"
          onClick={() =>
            navigate(`/shows/${currentEpisode.showId}/season/${currentEpisode.seasonNumber}/episode/${currentEpisode.episode}`)
          }
        />

        <div className="global-player__info">
          <strong>{currentEpisode.showTitle} - Season {currentEpisode.seasonNumber}</strong>
          <br />
          <small>Episode {currentEpisode.episode}: {currentEpisode.title}</small>
        </div>

        <button onClick={togglePlayback} className="global-player__button">
          {isPlaying ? "⏸" : " ▶ "}
        </button>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="global-player__button"
        >
          {isExpanded ? "🔽" : "🔼"}
        </button>
      </div>

      {isExpanded && (
        <div className="global-player__body">
          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (progress / duration) * 100 : 0}
            onChange={seek}
          />
          <small>
            {formattedTime(progress)} / {formattedTime(duration)}
          </small>

          <div className="global-player__volume">
            <button
              onClick={() => toggleMute()}
              className="volume-icon-button"
              aria-label="Toggle mute"
            >
              {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => {
                const value = Number(e.target.value);
                setVolume(value);
                if (value > 0) setLastVolume(value);
              }}
            />
          </div>

          <div className="global-player-util-buttons">
            <button
              onClick={() =>
                navigate(`/shows/${currentEpisode.showId}/season/${currentEpisode.seasonNumber}/episode/${currentEpisode.episode}`)
              }
              className="global-player-open-btn"
            >
              Open Full Player 🎧
            </button>

            <button
              onClick={() => setShowConfirm(true)}
              className="global-player-close-btn"
              title="Close Player"
              aria-label="Close Player"
            >
              <FaRegWindowClose />
            </button>

            {showConfirm && (
              <ConfirmModal
                message="Are you sure you want to stop and close the player?"
                onConfirm={confirmClosePlayer}
                onCancel={() => setShowConfirm(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
