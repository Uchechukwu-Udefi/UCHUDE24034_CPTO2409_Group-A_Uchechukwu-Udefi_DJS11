import { usePlayback } from "../../context/PlaybackContext";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const { favorites, removeFavorite } = usePlayback();
  const navigate = useNavigate();

  if (favorites.length === 0) {
    return <div className="favorite-container"><h1>Favorites</h1><p>No favorites added.</p></div>;
  }

  const grouped = favorites.reduce((acc, ep) => {
    const key = `${ep.showTitle} - Season ${ep.seasonNumber}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ep);
    return acc;
  }, {});

  return (
    <div className="favorite-container">
      <h1>Favorites</h1>
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
                    navigate(`/shows/${ep.showId}/season/${ep.seasonNumber}/episode/${ep.episode}`)
                  }
                  className="favorite-play-button"
                >
                  ▶ Play
                </button>
                <button
                  onClick={() => removeFavorite(ep._key)}
                  className="favorite-remove-button"
                >
                  ✖ Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
