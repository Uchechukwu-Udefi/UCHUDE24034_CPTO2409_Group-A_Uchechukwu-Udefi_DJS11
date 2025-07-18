import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchShowById } from "/server";
import { usePlayback } from "../../context/PlaybackContext";
import BackButton from "../../components/BackButton";
import { FaStar, FaRegStar } from "react-icons/fa";
import Loading from "../../components/LoadingSpinner";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";


export default function EpisodePlayer() {
  const { id, seasonNumber, episodeId } = useParams();
  const navigate = useNavigate();

  const [episode, setEpisode] = useState(null);
  const [progress, setProgress] = useState(0);

  const {
    playShow,
    audioRef,
    loadSeason,
    seasonEpisodes,
    favorites,
    toggleFavorite,
    isPlaying,
    togglePlayback,
    volume,
    setVolume,
    currentEpisode,
    toggleMute,
    setLastVolume
  } = usePlayback();

  const episodeIndex = Number(episodeId) - 1;
  const isFavorite = episode && favorites.some(fav => fav._key === episode._key);

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
          _key: `${show.id}-${season.season}-${ep.episode || ep.id}`,
          showId: show.id,
          showTitle: show.title,
          seasonNumber: season.season,
          seasonImage: season.image,
          audioUrl: ep.audioUrl || ep.file || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        };

        setEpisode(enriched);

        // If not the current episode, update global state
        if (!currentEpisode || currentEpisode._key !== enriched._key) {
          playShow(enriched);
        }
      } catch (err) {
        console.error("Episode load failed", err);
      }
    }

    fetchEpisode();
  }, [id, seasonNumber, episodeId]);

  // Track progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setProgress(audio.currentTime);
    audio.addEventListener("timeupdate", updateProgress);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, [audioRef]);

  // Only play if isPlaying is true — don't pause if coming from GlobalPlayer
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !episode) return;

    if (isPlaying && audio.paused) {
      audio.play().catch((e) => {
        console.warn("Playback error:", e);
      });
    }
  }, [isPlaying, episode, audioRef]);

  const seek = (e) => {
    const audio = audioRef.current;
    const percent = e.target.value;
    if (audio?.duration) {
      audio.currentTime = (audio.duration * percent) / 100;
    }
  };

  const goToEpisode = (index) => {
    if (index < 0 || index >= seasonEpisodes.length) return;
    navigate(`/shows/${id}/season/${seasonNumber}/episode/${index + 1}`);
  };

  if (!episode) return <Loading />;

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
          <button
            onClick={() => toggleMute()}
            className="volume-icon-button"
            aria-label="Toggle mute"
          >
            {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
          </button>
          <input
            id="volume"
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
            className="player__volume-slider"
          />

          <button onClick={() => toggleFavorite(episode)} className="favorite-button">
            {isFavorite ? <FaStar /> : <FaRegStar />}
          </button>
        </div>
      </div>

      <BackButton />
    </div>
  );
}
