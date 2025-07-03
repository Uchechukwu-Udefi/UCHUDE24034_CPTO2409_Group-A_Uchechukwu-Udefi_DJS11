// pages/History.js
import { usePlayback } from "../../context/PlaybackContext.jsx";

export default function Favorites() {
  const { currentShow, history } = usePlayback();

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <h1>🎧 Current Playing</h1>
      {currentShow ? (
        <div>
          <h2>{currentShow.title}</h2>
          <p>{currentShow.description}</p>
        </div>
      ) : (
        <p>No show is currently playing.</p>
      )}

      <hr />

      <h2>🕘 Last Played</h2>
      {history.length > 0 ? (
        <ul>
          {history.map((show) => (
            <li key={show.id}>
              <strong>{show.title}</strong> – {show.seasons} seasons
            </li>
          ))}
        </ul>
      ) : (
        <p>No playback history yet.</p>
      )}
    </div>
  );
}