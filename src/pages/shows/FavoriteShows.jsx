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
    <div style={{ padding: "2rem" }}>
      <h1>Recently Played</h1>
      {Object.entries(grouped).length === 0 && <p>No recent plays.</p>}

      {Object.entries(grouped).map(([seasonKey, episodes]) => (
        <div key={seasonKey} style={{ marginBottom: "2rem" }}>
          <h2>{seasonKey}</h2>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {episodes.map(ep => (
              <li key={ep._key} style={{ marginBottom: "0.5rem", display: "flex", alignItems: "center" }}>
                <img
                  src={ep.seasonImage}
                  alt=""
                  style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4, marginRight: 12 }}
                />
                <div style={{ flex: 1 }}>
                  <strong>{ep.title}</strong>
                  <br />
                  <small>Episode {ep.episode}</small>
                </div>
                <button
                  onClick={() =>
                    navigate(`/shows/${ep.showId || ep.id}/season/${ep.seasonNumber}/episode/${ep.episode}`)
                  }
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
