import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchPreviews, fetchShowById, genreMap } from "/server";

export default function Genre() {
  const navigate = useNavigate();
  const { genreId } = useParams(); 
  const genreName = genreMap[genreId];

  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShowsByGenre() {
      try {
        const previews = await fetchPreviews();
        console.log("⏳ Loaded previews:", previews.length);

        // Log each preview's genre
        previews.forEach(p => console.log("Preview:", p.title, "genre:", p.genre));

        const filtered = previews.filter(preview => {
          const ids = Array.isArray(preview.genres)
            ? preview.genres
            : [preview.genres];
          const match = ids.includes(Number(genreId));
          if (match) console.log("✅ Matched preview:", preview.title);
          return match;
        });

        console.log("📦 Sample preview:", previews[0])

        const fullShows = await Promise.all(
          filtered.map(show => fetchShowById(show.id))
        );

        console.log("Full show details loaded:", fullShows.length);
        setShows(fullShows);
      } catch (err) {
        console.error("Error loading genre shows:", err);
      } finally {
        setLoading(false);
      }
    }

    console.log("Fetching shows for genreId:", genreId);
    loadShowsByGenre();
  }, [genreId]);

  if (!genreName) return <p>❗ Unknown genre ID: {genreId}</p>;
  if (loading) return <p>Loading shows for {genreName}...</p>;

  return (
    <div>
      <h1>{genreName}</h1>

      <div>
            {shows.length > 0 ? (
            <div>
            {shows.map(show => (
                <div key={show.id}>
                <strong>{show.title}</strong> ({show.seasons.length} seasons)
                </div>
            ))}
            </div>
        ) : (
            <p>No shows found for this genre.</p>
        )}
      </div>
      
      <button onClick={() => navigate("/shows")}>← Back to Genres</button>
    </div>
  );
}
