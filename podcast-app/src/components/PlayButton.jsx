import { usePlayback } from '../context/PlaybackContext';

export function PlayButton({ episode }) {
  const { currentEpisode, setCurrentEpisode } = usePlayback();

  const isCurrentEpisode = currentEpisode?.id === episode.id;

  return (
    <button
      onClick={() => setCurrentEpisode(isCurrentEpisode ? null : episode)}
      className={`px-4 py-2 rounded-full ${
        isCurrentEpisode ? 'bg-red-500' : 'bg-blue-500'
      } text-white`}
    >
      {isCurrentEpisode ? 'Pause' : 'Play'}
    </button>
  );
}