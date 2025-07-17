import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPreviews, fetchShowById, genreMap } from "/server";
import Loading from "../../components/LoadingSpinner";
import BackButton from "../../components/BackButton";

export default function Genre() {
  const { genreId } = useParams(); 
  const genreName = genreMap[genreId];

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShowsByGenre() {
      try {
        const previews = await fetchPreviews();
        
        if (!previews || previews.length === 0) {
          console.warn("No previews found for genre:", genreId);
          return;
        }
        // Filter shows by genre ID
        const filtered = previews.filter(preview => {
          const ids = Array.isArray(preview.genres)
            ? preview.genres
            : [preview.genres];
          const match = ids.includes(Number(genreId));
          return match;
        });

        const fullShows = await Promise.all(
          filtered.map(show => fetchShowById(show.id))
        );

        setShows(fullShows);
      } catch (err) {
        console.error("Error loading genre shows:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadShowsByGenre();
  }, [genreId]);

  if (!genreName) return <p>❗ Unknown genre ID: {genreId}</p>;
  if (loading) return <Loading />;

  return (
    <div className="show-list">
      <h1>{genreName}</h1>

      <div>
            {shows.length > 0 ? (
            <div className="show-list-container">
            {shows.map(show => (
                <div key={show.id} className="show-list-item">
                    <img src={show.image} alt={show.title} />
                <strong>{show.title}</strong> 
                <strong>{show.seasons.length} Seasons</strong>
                <Link to={`/shows/${show.id}`}>View Details</Link>
                </div>
            ))}
            </div>
        ) : (
            <p>No shows found for this genre.</p>
        )}
      </div>
      {/* Back button to navigate to the previous page */}
      <BackButton />
    </div>
  );
}
