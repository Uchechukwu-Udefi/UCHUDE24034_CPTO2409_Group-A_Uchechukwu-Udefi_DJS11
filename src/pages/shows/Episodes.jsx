import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchShowById } from "/server"; // Adjust path if needed
import { usePlayback } from "../../context/PlaybackContext";

export default function EpisodePlayer() {
  const { id, seasonNumber, episodeId } = useParams();
  const navigate = useNavigate();

  const [episode, setEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  const { playShow, audioRef, loadSeason, seasonEpisodes } = usePlayback();
  const episodeIndex = Number(episodeId) - 1;

  // Fetch episode + season data
  useEffect(() => {
    async function fetchEpisode() {
      try {
        const show = await fetchShowById(id);
        const season = show.seasons.find(s => String(s.season) === seasonNumber);
        if (!season) return;

        const episodes = season.episodes || [];
        loadSeason(episodes);

        const ep = episodes[episodeIndex];
        if (!ep) return;

        const enriched = {
          ...ep,
          showId: show.id,
          showTitle: show.title,
          seasonNumber: season.season,
          seasonImage: season.image,
          audioUrl: ep.audioUrl || ep.file || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        };

        setEpisode(enriched);
        playShow(enriched);
      } catch (err) {
        console.error("Episode load failed", err);
      }
    }

    fetchEpisode();
  }, [id, seasonNumber, episodeId]);

  // Sync UI with audio element
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

    if (audio.paused) {
      audio.play().catch((err) => console.warn("Play failed:", err));
    } else {
      audio.pause();
    }
  };

  const seek = (e) => {
    const audio = audioRef.current;
    const percent = e.target.value;
    audio.currentTime = (audio.duration * percent) / 100;
  };

  const handleVolumeChange = (e) => {
    const value = Number(e.target.value);
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  };

  const goToEpisode = (index) => {
    if (index < 0 || index >= seasonEpisodes.length) return;
    navigate(`/shows/${id}/season/${seasonNumber}/episode/${index + 1}`);
  };

  if (!episode) return <div>Loading episode...</div>;

  const audio = audioRef.current;
  const duration = audio?.duration || 0;

  const formattedTime = (s) =>
    isNaN(s) ? "--:--" : new Date(s * 1000).toISOString().substr(14, 5);

  return (
    <div style={{ padding: "1rem", paddingBottom: "4rem" }}>
      <img src={episode.seasonImage} alt="" style={{ width: "200px" }} />
      <h1>{episode.showTitle} - Season {episode.seasonNumber}</h1>
      <h2>Episode: {episodeId} - {episode.title}</h2>
      <p>{episode.description}</p>

      <button onClick={() => navigate(`/shows/${id}/season/${seasonNumber}`)}>
        ← Back to Season
      </button>

      <div style={{
        marginTop: "2rem",
        padding: "1rem",
        background: "#eee",
        borderRadius: "8px"
      }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <button onClick={() => goToEpisode(episodeIndex - 1)} disabled={episodeIndex <= 0}>
            ⏮ Prev
          </button>

          <button onClick={togglePlayback} style={{ margin: "0 1rem" }}>
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>

          <button onClick={() => goToEpisode(episodeIndex + 1)} disabled={episodeIndex >= seasonEpisodes.length - 1}>
            Next ⏭
          </button>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={duration ? (progress / duration) * 100 : 0}
          onChange={seek}
          style={{ width: "80%" }}
        />
        <div>
          {formattedTime(progress)} / {formattedTime(duration)}
        </div>

        <div style={{ marginTop: "0.5rem" }}>
          Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            style={{ width: "100px", marginLeft: "1rem" }}
          />
        </div>
      </div>
    </div>
  );
}
