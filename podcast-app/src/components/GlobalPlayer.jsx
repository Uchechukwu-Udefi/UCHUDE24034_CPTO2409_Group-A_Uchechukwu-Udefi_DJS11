import { useEffect, useState } from "react";
import { usePlayback } from "../context/PlaybackContext";
import { useNavigate } from "react-router-dom";

export default function GlobalPlayer() {
  const { currentEpisode, audioRef } = usePlayback();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

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
    <div style={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      background: "#fff",
      borderTop: "1px solid #ccc",
      zIndex: 1000,
      padding: isExpanded ? "1rem" : "0.5rem 1rem",
      display: "flex",
      flexDirection: isExpanded ? "column" : "row",
      alignItems: isExpanded ? "flex-start" : "center",
      gap: isExpanded ? "1rem" : "0.5rem",
    }}>
      {/* Top row: collapsed view */}
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <img
          src={currentEpisode.seasonImage}
          alt=""
          style={{ width: 50, height: 50, borderRadius: 4, marginRight: 12, objectFit: "cover" }}
          onClick={() => navigate(`/shows/${currentEpisode.showId || currentEpisode.id}/season/${currentEpisode.seasonNumber}/episode/${currentEpisode.episode}`)}
        />
        <div style={{ flex: 1 }}>
          <strong>{currentEpisode.showTitle}</strong><br />
          <small>{currentEpisode.title}</small>
        </div>

        <button onClick={togglePlayback}>
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button onClick={() => setIsExpanded(!isExpanded)} style={{ marginLeft: "1rem" }}>
          {isExpanded ? "🔽" : "🔼"}
        </button>
      </div>

      {isExpanded && (
        <>
          {/* Seek Bar */}
          <div style={{ width: "100%" }}>
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (progress / duration) * 100 : 0}
              onChange={seek}
              style={{ width: "100%" }}
            />
            <small>{formattedTime(progress)} / {formattedTime(duration)}</small>
          </div>

          {/* Volume */}
          <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "1rem" }}>
            <span>Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              style={{ flex: 1 }}
            />
          </div>

          <button
            onClick={() =>
              navigate(`/now-playing`)
            }
            style={{ alignSelf: "flex-end", marginTop: "0.5rem" }}
          >
            Open Full Player 🎧
          </button>
        </>
      )}
    </div>
  );
}
