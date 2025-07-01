import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchPreviews, fetchShowById, genreMap } from "/server";

export default function Genre() {
  const { navigate } = useNavigate();  // Get genreId from the route
  const { genreId } = useParams();  // Get genreId from the route
  const genreName = genreMap[genreId];  // Map ID to genre name

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShowsByGenre() {
      try {
        const previews = await fetchPreviews();

        // Filter previews to only those with matching genre ID
        const filtered = previews.filter(preview => {
          const ids = Array.isArray(preview.genre) ? preview.genre : [preview.genre];
          return ids.includes(Number(genreId));
        });

        // Fetch full details for those filtered shows
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

  if (!genreName) return <p>Unknown genre</p>;
  if (loading) return <p>Loading shows for {genreName}...</p>;

  return (
    <div>
        <button onClick={() => navigate("/")}>← Back to Genres</button>
      <h1>{genreName}</h1>
      <ul>
        {shows.map(show => (
          <li key={show.id}>
            <strong>{show.title}</strong> ({show.seasons.length} seasons)
          </li>
        ))}
      </ul>
    </div>
  );
}
