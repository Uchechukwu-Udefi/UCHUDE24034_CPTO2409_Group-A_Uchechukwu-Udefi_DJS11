import { usePlayback } from "../context/PlaybackContext";

function HistoryPage() {
  const {
    history,
    progressMap,
    playShow,
    resetProgress,
  } = usePlayback();

  const handlePlay = (episode) => {
    playShow(episode);
  };

  const handleReset = () => {
    const confirmed = window.confirm("Are you sure you want to reset your listening history?");
    if (confirmed) {
      resetProgress();
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Your Listening History</h1>

      {history.length === 0 ? (
        <p>You haven’t listened to any episodes yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {history.map((episode) => {
            const progress = progressMap[episode._key] || 0;

            return (
              <li
                key={episode._key}
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "1rem 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              > 
                <div style={{ flex: "1 1 10%", display: "flex", alignItems: "center" }}>
                  <img src={episode.seasonImage} alt={`Cover for ${episode.title}`} style={{ width: "100px", borderRadius: "4px" }} />
                </div>
                <div style={{ flex: "1 1 70%" }}>
                  <strong>{episode.title}</strong>
                  <br />
                  <small>
                    Season {episode.seasonNumber}, Episode {episode.episode}
                  </small>

                  <div
                    style={{
                      marginTop: "0.5rem",
                      backgroundColor: "#eee",
                      height: "6px",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progress === 100 ? "green" : "#007bff",
                        height: "100%",
                        transition: "width 0.2s",
                      }}
                    ></div>
                  </div>
                  <small>{progress}% listened</small>
                </div>

                <div>
                  <button
                    onClick={() => handlePlay(episode)}
                    style={{ marginLeft: "1rem" }}
                  >
                    ▶ Play
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {history.length > 0 && (
        <button
          onClick={handleReset}
          style={{
            marginTop: "2rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#ff4d4f",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reset Listening History
        </button>
      )}
    </div>
  );
}

export default HistoryPage;
