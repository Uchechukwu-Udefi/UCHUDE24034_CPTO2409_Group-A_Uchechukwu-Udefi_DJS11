import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchShowById } from '/server';

export default function ShowPage() {
    const { id } = useParams();
  const [show, setShow] = useState(null);
  const [openSeasonIndex, setOpenSeasonIndex] = useState(null); // use index for consistency

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

  const toggleSeason = (index) => {
    setOpenSeasonIndex(prev => (prev === index ? null : index));
  };

  if (!show) return <p>Loading show...</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{show.title}</h1>
      <img src={show.image} alt={show.title} style={{ width: '200px', marginBottom: '1rem' }} />
      <p>{show.description}</p>

      <h2>Seasons</h2>
      {show.seasons?.map((season, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <button
            onClick={() => toggleSeason(index)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#634DB8',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '10px',
              width: '100%',
              textAlign: 'left',
            }}
          >
            {openSeasonIndex === index ? '▼' : '▶'} Season {season.season}
          </button>

          {openSeasonIndex === index && (
            <div style={{ paddingLeft: '10px' }}>
              {season.episodes.map((episode) => (
                <div key={episode.id} style={{ marginBottom: '10px' }}>
                  <strong>{episode.title}</strong><br />
                  <audio controls src={episode.file}></audio>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
