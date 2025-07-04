import { useEffect, useRef } from 'react';
import { usePlayback } from "../context/PlaybackContext.jsx";

// Player component to handle audio playback and UI
// Displays current episode details and controls for playback
export function Player() {
  const { currentEpisode, isPlaying } = usePlayback();
  const audioRef = useRef(null);

  // Handle play/pause when currentEpisode changes
  useEffect(() => {
    if (!audioRef.current) return;

    if (currentEpisode) {
      audioRef.current.src = currentEpisode.file;
      audioRef.current.play().catch(e => {
        console.error("Autoplay prevented:", e);
        // You might want to show a "click to play" button here
      });
    } else {
      audioRef.current.pause();
    }
  }, [currentEpisode]);

  if (!currentEpisode) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img 
            src={currentEpisode.image || '/default-episode.jpg'} 
            alt={currentEpisode.title}
            className="w-16 h-16 rounded"
          />
          <div>
            <h3 className="font-bold">{currentEpisode.title}</h3>
            <p className="text-sm text-gray-600">{currentEpisode.podcastName}</p>
          </div>
        </div>

        <audio
          ref={audioRef}
          controls
          className="flex-1 mx-4"
          onEnded={() => setCurrentEpisode(null)}
        />

        <div className="flex space-x-2">
          <button 
            onClick={() => setCurrentEpisode(null)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}