import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { fetchPreviews } from "/server";
import Loading from "../components/LoadingSpinner";

export default function Home() {
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const data = await fetchPreviews();
        setPreviews(data);
      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  const randomFour = useMemo(() => {
    return [...previews].sort(() => 0.5 - Math.random()).slice(0, 4);
  }, [previews]);

  return (
    <div className="home-container">
      <div className="home-intro">
        <h1>The #1 Show Platform, Specially Made For You.</h1>
        <p>Dive into a world of endless adventures with UTune.</p>
        <p>
          Whether you are relaxing, learning, or exploring new ideas, we’ve got
          the perfect shows for you.
        </p>
        <p>Discover content that resonates your way.</p>
      </div>

      <h2>Featured shows for you</h2>
      <div className="home-preview-card">
        {loading ? (
          <div className="loading-state"><Loading /></div>
        ) : (
          randomFour.map((preview) => (
            <div key={preview.id} className="preview-card">
              <Link to={`/shows/${preview.id}`}>
                <img src={preview.image} alt={preview.title} />
                <h3>{preview.title}</h3>
              </Link>
            </div>
          ))
        )}
      </div>

      <Link to="/shows" className="explore-more">
        Explore More
      </Link>
    </div>
  );
}
