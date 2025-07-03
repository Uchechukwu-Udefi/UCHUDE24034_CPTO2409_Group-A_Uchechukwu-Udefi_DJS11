import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchShowById } from '/server';
import { PlayButton } from '../../components/PlayButton';

export default function Season() {
  const { id, seasonNumber } = useParams();
  const navigate = useNavigate();
  const [seasonData, setSeasonData] = useState(null);

  useEffect(() => {
    async function loadSeason() {
      try {
        const show = await fetchShowById(id);
        const season = show.seasons.find(s => String(s.season) === seasonNumber);
        if (season) {
          setSeasonData({
            title: show.title,
            season,
          });
        }
      } catch (error) {
        console.error("Error loading season:", error);
      }
    }

    loadSeason();
  }, [id, seasonNumber]);

  if (!seasonData) return <p>Loading season...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{seasonData.title} - Season {seasonData.season.season}</h1>
      <img src={seasonData.season.image} alt={`Season ${seasonData.season.season}`} style={{ width: '200px' }} />

      <h2>Episodes</h2>
      {seasonData.season.episodes.map((episode, index) => (
        <div key={episode.id} style={{ marginBottom: '10px' }}>
            <strong>Episode: {index + 1}</strong><br />
          <strong>{episode.title}</strong><br />
            <span>{episode.description}</span><br />
          <PlayButton episode={episode} />
        </div>
      ))}

      <button onClick={() => navigate(`/shows/${id}`)}>← Back to Show</button>
    </div>
  );
}