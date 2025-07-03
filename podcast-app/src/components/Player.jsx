import { useState } from "react";
import { usePlayback } from "./PlaybackContext";

export const Player = ({ isOpen, onClose }) => {
  const { currentEpisode } = usePlayback();
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isOpen || !currentEpisode) return null;

  return (
    <div className="player-container">
      {!isMinimized ? (
        <div className="player-full">
          <h3>{currentEpisode.title}</h3>
          <audio autoPlay controls src={currentEpisode.file} style={{ width: '100%' }}></audio>
          <div className="player-controls">
            <button onClick={() => setIsMinimized(true)}>Minimize</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      ) : (
        <div className="player-minimized">
          <span>Now Playing: {currentEpisode.title}</span>
          <div>
            <button onClick={() => setIsMinimized(false)}>Expand</button>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
