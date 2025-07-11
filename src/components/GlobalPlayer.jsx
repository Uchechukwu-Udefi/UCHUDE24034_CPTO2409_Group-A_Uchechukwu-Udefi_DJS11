import { useEffect, useState } from "react";
import { usePlayback } from "../context/PlaybackContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRegWindowClose } from "react-icons/fa";
import ConfirmModal from "./ConfirmModal";

export default function GlobalPlayer() {
  const { currentEpisode, setCurrentEpisode, audioRef } = usePlayback();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Hide player on the EpisodePlayer page
  const isEpisodePage = /\/shows\/[^/]+\/season\/[^/]+\/episode\/[^/]+/.test(location.pathname);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioRef]);

  if (isEpisodePage) return null;

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.paused ? audio.play() : audio.pause();
  };

  const handleVolumeChange = (e) => {
    const value = Number(e.target.value);
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  };

  const handleCloseClick = () => {
    setShowConfirm(true); // show the confirmation modal
  };

  const confirmClosePlayer = () => {
    setShowConfirm(false); // hide modal

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setIsExpanded(false);

    if (typeof setCurrentEpisode === "function") {
      setCurrentEpisode(null);
    }
  };

  const cancelClose = () => {
    setShowConfirm(false);
  };

  const seek = (e) => {
    const audio = audioRef.current;
    const percent = e.target.value;
    audio.currentTime = (audio.duration * percent) / 100;
  };

  const formattedTime = (s) =>
    isNaN(s) ? "--:--" : new Date(s * 1000).toISOString().substr(14, 5);

  const duration = audioRef.current?.duration || 0;

  if (!currentEpisode) return null;

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
          <strong>{currentEpisode.showTitle}</strong>
          <br />
          <small>{currentEpisode.title}</small>
        </div>

        <button onClick={togglePlayback} className="global-player__button">
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button onClick={() => setIsExpanded(!isExpanded)} className="global-player__button">
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
            Volume:
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
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
            onClick={handleCloseClick}
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
              onCancel={cancelClose}
            />
          )}
          </div>
        </div>
      )}
    </div>
  );
}
