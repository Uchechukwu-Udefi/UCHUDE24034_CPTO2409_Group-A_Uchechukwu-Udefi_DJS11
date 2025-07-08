import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchShowById } from '/server';
import Loading from '../../components/LoadingSpinner';

export default function ShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    <div style={{ padding: '1rem' }}>
      <h1>{show.title}</h1>
      <img src={show.image} alt={show.title} style={{ width: '200px', marginBottom: '1rem' }} />
      <p>{show.description}</p>
      <p><strong>Genres:</strong> {show.genres}</p>
      <p><strong>Last Updated:</strong> {new Date(show.updated).toLocaleDateString()}</p>

      <h2>{show.seasons.length} Seasons</h2>
      <div className='seasons-container'>
      {show.seasons?.map((season, index) => (
      <div key={index} className='seasons-card'>
        <Link to={`/shows/${show.id}/season/${season.season}`}>
          <img src={season.image} alt={`Season ${season.season}`} style={{ width: '150px', marginBottom: '10px' }} />
          <button className='seasons-button'>
            Season {season.season}
          </button>
        </Link>
  </div>
))}

      </div>
      <button onClick={() => navigate("/shows")}>← Back to Genres</button>
    </div>
  );
}
