import { usePlayback } from "../context/PlaybackContext";

function HistoryPage() {
  const {
    history,
    progressMap,
    playShow,
    resetProgress,
    togglePlayback,
    isPlaying,
    currentEpisodeKey,
  } = usePlayback();

  const handlePlay = (episode) => {
    // If the clicked episode is already playing, just toggle
    if (currentEpisodeKey === episode._key) {
      togglePlayback();
    } else {
      playShow(episode); // will set currentEpisodeKey
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm("Are you sure you want to reset your listening history?");
    if (confirmed) {
      resetProgress();
    }
  };

  return (
    <div className="history-container">
      <h1>Your Listening History</h1>

      {history.length === 0 ? (
        <p>You haven’t listened to any episodes yet.</p>
      ) : (
        <ul className="history-list">
          {history.map((episode) => {
            const progress = progressMap[episode._key] || 0;
            const isEpisodePlaying = currentEpisodeKey === episode._key && isPlaying;

            return (
              <li key={episode._key} className="history-item">
                <div className="history-image-container">
                  <img
                    src={episode.seasonImage}
                    alt={`Cover for ${episode.title}`}
                    className="history-image"
                  />
                </div>
                <div className="history-content">
                  <strong>{episode.title}</strong>
                  <br />
                  <small>
                    Season {episode.seasonNumber}, Episode {episode.episode}
                  </small>

                  <div className="history-progress-bar">
                    <div
                      className="history-progress-fill"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progress === 100 ? "green" : "#007bff",
                      }}
                    ></div>
                  </div>
                  <small>{progress}% listened</small>
                </div>

                <div>
                  <button
                    onClick={() => handlePlay(episode)}
                    className="history-play-button"
                  >
                    {isEpisodePlaying ? "⏸ Pause" : "▶ Play"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {history.length > 0 && (
        <button onClick={handleReset} className="history-reset-button">
          Reset Listening History
        </button>
      )}
    </div>
  );
}

export default HistoryPage;
