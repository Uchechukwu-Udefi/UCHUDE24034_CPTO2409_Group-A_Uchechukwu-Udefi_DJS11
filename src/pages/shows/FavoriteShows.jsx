import { usePlayback } from "../../context/PlaybackContext";
import { useState } from "react";

export default function Favorites() {
  const {
    favorites,
    removeFavorite,
    playShow,
    togglePlayback,
    currentEpisodeKey,
    isPlaying,
  } = usePlayback();
  const [sortOption, setSortOption] = useState("recent");

  if (favorites.length === 0) {
    return <div className="favorite-container"><h1>Favorites</h1><p>No favorites added.</p></div>;
  }

  // Sorting logic
  const sortedFavorites = [...favorites].sort((a, b) => {
    const dateA = new Date(a.addedAt || 0);
    const dateB = new Date(b.addedAt || 0);

    switch (sortOption) {
      // Sort by episode title
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "oldest":
        return dateA - dateB; // Ascending
      case "recent":
      default:
        return dateB - dateA; // Descending
    }
  });

  const grouped = sortedFavorites.reduce((acc, ep) => {
    const key = `${ep.showTitle} - Season ${ep.seasonNumber}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(ep);
    return acc;
  }, {});

  const handlePlay = (ep) => {
    if (currentEpisodeKey === ep._key) {
      togglePlayback();
    } else {
      playShow(ep);
    }
  };

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
            {episodes.map((ep) => {
              const isEpisodePlaying = currentEpisodeKey === ep._key && isPlaying;

              return (
                <li key={ep._key} className="favorite-episode-item">
                  <div className="favorite-episode-details">
                     <img src={ep.seasonImage} alt={ep.title} className="favorite-episode-image" />
                    <div className="favorite-episode-info">
                      <strong>{ep.title}</strong>
                      <br />
                      <small>Episode {ep.episode}</small>
                    </div>
                  </div>
                 
                 <div className="favorite-episode-actions">
                    <p><strong>Added on:</strong> {new Date(ep.addedAt || 0).toLocaleDateString()}</p>
                    <button
                      onClick={() => handlePlay(ep)}
                      className="favorite-play-button"
                    >
                      {isEpisodePlaying ? "⏸ Pause" : "▶ Play"}
                    </button>
                    <button
                      onClick={() => removeFavorite(ep._key)}
                      className="favorite-remove-button"
                    >
                      ✖ Remove
                    </button>
                 </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}