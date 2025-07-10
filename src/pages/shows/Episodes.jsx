import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchShowById } from "/server";
import { usePlayback } from "../../context/PlaybackContext";
import { IoIosArrowBack } from "react-icons/io";

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
    <div className="episode-player">
      <img src={episode.seasonImage} alt={`Cover for ${episode.showTitle}`} className="episode-player__image" />
      
      <h1 className="episode-player__title">
        {episode.showTitle} - Season {episode.seasonNumber}
      </h1>
      
      <h2 className="episode-player__subtitle">
        Episode {episodeId}: {episode.title}
      </h2>
      
      <p className="episode-player__description">{episode.description}</p>

      <div className="episode-player__controls">
        <div className="episode-player__buttons">
          <button
            onClick={() => goToEpisode(episodeIndex - 1)}
            disabled={episodeIndex <= 0}
            className="episode-player__button"
          >
            ⏮ Prev
          </button>

          <button onClick={togglePlayback} className="episode-player__button">
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>

          <button
            onClick={() => goToEpisode(episodeIndex + 1)}
            disabled={episodeIndex >= seasonEpisodes.length - 1}
            className="episode-player__button"
          >
            Next ⏭
          </button>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={duration ? (progress / duration) * 100 : 0}
          onChange={seek}
          className="episode-player__seekbar"
        />

        <div className="episode-player__time">
          {formattedTime(progress)} / {formattedTime(duration)}
        </div>

        <div className="episode-player__volume">
          <label htmlFor="volume">Volume:</label>
          <input
            id="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="player__volume-slider"
          />
        </div>
      </div>

      <button
        onClick={() => navigate(`/shows/${id}/season/${seasonNumber}`)}
        className="back-button"
      >
        <IoIosArrowBack />
      </button>
    </div>
  );
}
