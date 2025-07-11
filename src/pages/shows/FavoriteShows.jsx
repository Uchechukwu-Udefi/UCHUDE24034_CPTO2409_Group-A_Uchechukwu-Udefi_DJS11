import { usePlayback } from "../../context/PlaybackContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Favorites() {
  const { favorites, removeFavorite } = usePlayback();
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("recent");

  if (favorites.length === 0) {
    return <div className="favorite-container"><h1>Favorites</h1><p>No favorites added.</p></div>;
  }

  // Sorting logic
  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortOption) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "oldest":
        return new Date(a.addedAt) - new Date(b.addedAt);
      case "recent":
      default:
        return new Date(b.addedAt) - new Date(a.addedAt);
    }
  });

  const grouped = sortedFavorites.reduce((acc, ep) => {
    const key = `${ep.showTitle} - Season ${ep.seasonNumber}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ep);
    return acc;
  }, {});

  return (
    <div className="favorite-container">
      <h1>Favorites</h1>

    
      {/* Sorting dropdown */}
      <div className="favorite-sort">
        <label htmlFor="sort">Sort by: </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="recent">Recently Added</option>
          <option value="oldest">Oldest Added</option>
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
        </select>
      </div>

      {/* Grouped favorites */}
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
                  <br />
                  {ep.addedAt && (
                    <small className="favorite-added-at">
                      Added on: {new Date(ep.addedAt).toLocaleString()}
                    </small>
                  )}
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
