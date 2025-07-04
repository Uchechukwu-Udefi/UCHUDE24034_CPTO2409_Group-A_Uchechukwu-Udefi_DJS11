import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { fetchShowById } from '/server';
import { usePlayback } from "../../context/PlaybackContext";
import { PlayButton } from "../../components/PlayButton.jsx";

export default function EpisodePage() {
  const { id, seasonNumber, episodeId } = useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState(null);

  const { currentEpisode, playShow } = usePlayback();

  useEffect(() => {
    async function fetchEpisode() {
      try {
        const show = await fetchShowById(id);
        const season = show.seasons.find(s => String(s.season) === seasonNumber);
        const ep = season?.episodes.find(e => String(e.id) === episodeId);

        if (ep) {
          const enrichedEpisode = {
            ...ep,
            showTitle: show.title,
            seasonNumber: season.season,
          };
          setEpisode(enrichedEpisode);
          playShow(enrichedEpisode); // Auto-play
        }
      } catch (error) {
        console.error("Failed to load episode", error);
      }
    }

    fetchEpisode();
  }, [id, seasonNumber, episodeId]);

  if (!episode) return <div>Loading...</div>;

  const isCurrentEpisode = currentEpisode?.id === episode.id;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{episode.showTitle} - Season {episode.seasonNumber}</h1>
      <h2>{episode.title}</h2>
      <p>{episode.description}</p>

      <PlayButton episode={episode} isPlaying={isCurrentEpisode} />

      <br /><br />
      <button onClick={() => navigate(`/shows/${id}/season/${seasonNumber}`)}>
        ← Back to Season
      </button>
    </div>
  );
}
