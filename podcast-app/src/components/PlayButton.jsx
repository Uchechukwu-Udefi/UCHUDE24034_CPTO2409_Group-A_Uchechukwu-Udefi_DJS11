import { usePlayback } from '../context/PlaybackContext';

export function PlayButton({ episode }) {
  const { currentEpisode, setCurrentEpisode } = usePlayback();
  const isCurrent = currentEpisode?.id === episode.id;

  return (
    <button
      onClick={() => setCurrentEpisode(isCurrent ? null : episode)}
      className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded"
    >
      {isCurrent ? (
        <>
          <span>Pause</span>
        </>
      ) : (
        <>
          <span>Play Episode</span>
        </>
      )}
    </button>
  );
}