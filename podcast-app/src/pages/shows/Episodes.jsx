import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { fetchShowById } from '/server';
import { usePlayback } from '../../context/PlaybackContext.jsx';
import { Player } from '../../components/Player.jsx';

export default function EpisodePage() {
  const { id, seasonNumber, episodeId } = useParams();
  const navigate = useNavigate();
  const [episodeData, setEpisodeData] = useState(null);
  const [playerOpen, setPlayerOpen] = useState(true);

  const { playShow } = usePlayback();

  useEffect(() => {
    async function loadEpisode() {
      try {
        const show = await fetchShowById(id);
        const season = show.seasons.find(s => String(s.season) === seasonNumber);
        const episode = season?.episodes.find(e => String(e.id) === episodeId);

        if (season && episode) {
          const fullEpisode = {
            ...episode,
            showTitle: show.title,
            seasonNumber: season.season,
          };
          setEpisodeData(fullEpisode);
          playShow(fullEpisode); // set in context for Player
        }
      } catch (error) {
        console.error("Error loading episode:", error);
      }
    }

    loadEpisode();
  }, [id, seasonNumber, episodeId, playShow]);

  if (!episodeData) return <p>Loading episode...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{episodeData.showTitle} - Season {episodeData.seasonNumber}</h1>
      <h2>{episodeData.title}</h2>
      <p>{episodeData.description}</p>

      <Player isOpen={playerOpen} onClose={() => setPlayerOpen(false)} />

      <br /><br />
      <button onClick={() => navigate(`/shows/${id}/season/${seasonNumber}`)}>
        ← Back to Season
      </button>
    </div>
  );
}
