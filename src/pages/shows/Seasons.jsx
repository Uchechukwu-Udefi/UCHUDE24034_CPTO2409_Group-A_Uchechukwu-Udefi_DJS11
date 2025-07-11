import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchShowById } from '/server';
import Loading from '../../components/LoadingSpinner';
import BackButton from '../../components/BackButton';

export default function Season() {
  const { id, seasonNumber } = useParams();
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

  if (!seasonData) return <Loading />;

  return (
    <div className="season-episode-container">
      <h1>{seasonData.title}</h1>
      <h1>Season {seasonData.season.season}</h1>
      <img
        src={seasonData.season.image}
        alt={`Season ${seasonData.season.season}`}
        className="season-episode-image"
      />

      <h2>{seasonData.season.episodes.length} Episodes</h2>
      <div className="season-episode-grid">
        {seasonData.season.episodes.map((episode, index) => (
          <div key={episode.id} className="season-episode-card">
            <Link to={`/shows/${id}/season/${seasonData.season.season}/episode/${index + 1}`}>
              <h3>Episode: {index + 1}</h3>
              <strong>{episode.title}</strong>
            </Link>
          </div>
        ))}
      </div>

      <BackButton />
    </div>
  );
}