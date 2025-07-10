// pages/History.js
import { usePlayback } from "../../context/PlaybackContext";
import { useNavigate } from "react-router-dom";

export default function Favorites() {

  const { history } = usePlayback();
  const navigate = useNavigate();

  // Limit to 5 most recent
  const recent = history.slice(0, 5);

  // Group by show and season
  const grouped = recent.reduce((acc, ep) => {
    const key = `${ep.showTitle} - Season ${ep.seasonNumber}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ep);
    return acc;
  }, {});

  return (
    <div className="favorite-container">
      <h1>Recently Played</h1>
      {Object.entries(grouped).length === 0 && <p>No recent plays.</p>}

      {Object.entries(grouped).map(([seasonKey, episodes]) => (
        <div key={seasonKey} className="favorite-season-group">
          <h2>{seasonKey}</h2>
          <ul className="favorite-episode-list">
            {episodes.map(ep => (
              <li key={ep._key} className="favorite-episode-item">
                <img
                  src={ep.seasonImage}
                  alt={`Season thumbnail for ${ep.title}`}
                  className="favorite-episode-image"
                />
                <div className="favorite-episode-info">
                  <strong>{ep.title}</strong>
                  <br />
                  <small>Episode {ep.episode}</small>
                </div>
                <button
                  onClick={() =>
                    navigate(`/shows/${ep.showId || ep.id}/season/${ep.seasonNumber}/episode/${ep.episode}`)
                  }
                  className="favorite-play-button"
                >
                  ▶ Play
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
