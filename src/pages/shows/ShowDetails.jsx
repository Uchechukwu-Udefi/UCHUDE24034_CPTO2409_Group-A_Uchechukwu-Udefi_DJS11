import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchShowById } from '/server';
import Loading from '../../components/LoadingSpinner';
import BackButton from '../../components/BackButton';

export default function ShowPage() {
  const { id } = useParams();
  const [show, setShow] = useState(null);

  useEffect(() => {
    async function loadShow() {
      try {
        const data = await fetchShowById(id);
        setShow(data);
      } catch (error) {
        console.error("Error loading show:", error);
      }
    }

    loadShow();
  }, [id]);


  if (!show) return <Loading />;

  return (
    <div className="season-container">
      <h1>{show.title}</h1>
      <img src={show.image} alt={show.title} className="season-image" />

      <p>{show.description}</p>
      <p><strong>Genres:</strong> {show.genres}</p>
      <p><strong>Last Updated:</strong> {new Date(show.updated).toLocaleDateString()}</p>

      <h2>{show.seasons.length} Seasons</h2>

      <div className="seasons-card-container">
        {show.seasons?.map((season, index) => (
          <div key={index} className="seasons-card">
            <Link to={`/shows/${show.id}/season/${season.season}`}>
              <img
                src={season.image}
                alt={`Season ${season.season}`}
                className="season-thumb"
              />
              <button className="seasons-button">
                Season {season.season}
              </button>
            </Link>
          </div>
        ))}
      </div>
        <BackButton />
      </div>
  );
}
