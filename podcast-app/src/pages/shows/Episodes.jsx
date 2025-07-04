import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { fetchShowById } from '/server';
import { usePlayback } from "../../context/PlaybackContext";

export default function EpisodePlayer() {
  const { id, seasonNumber, episodeId } = useParams(); // episodeId is now an index (1-based)
  const navigate = useNavigate();
  const [episode, setEpisode] = useState(null);
  const { playShow } = usePlayback();

  useEffect(() => {
    async function fetchEpisode() {
      try {
        const show = await fetchShowById(id);
        const season = show.seasons.find(s => String(s.season) === seasonNumber);
        if (!season || !season.episodes || season.episodes.length === 0) return;

        const index = Number(episodeId) - 1;
        if (isNaN(index) || index < 0 || index >= season.episodes.length) {
          console.warn("Invalid episode index:", episodeId);
          return;
        }

        const ep = season.episodes[index];
        const enrichedEpisode = {
          ...ep,
          showTitle: show.title,
          seasonNumber: season.season,
          seasonImage: season.image,
          audioUrl: ep.audioUrl || ep.file || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        };

        setEpisode(enrichedEpisode);
        playShow(enrichedEpisode);
      } catch (error) {
        console.error("Failed to load episode", error);
      }
    }

    fetchEpisode();
  }, [id, seasonNumber, episodeId]);

  if (!episode) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1rem', paddingBottom: '4rem' }}>
      <img src={episode.seasonImage} alt={`${episode.showTitle} - Season ${episode.seasonNumber}`} style={{ width: '200px', marginBottom: '1rem' }} />
      <h1>{episode.showTitle} - Season {episode.seasonNumber}</h1>
      <h2>Episode: {episodeId} - {episode.title}</h2>
      <p>{episode.description}</p>

      <button onClick={() => navigate(`/shows/${id}/season/${seasonNumber}`)}>
        ← Back to Season
      </button>
    </div>
  );
}
