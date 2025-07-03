import { createContext, useContext, useState, useEffect } from 'react';

const PlaybackContext = createContext();

export function PlaybackProvider({ children }) {
  // Try to load from localStorage if available
  const [currentEpisode, setCurrentEpisodeState] = useState(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('currentEpisode');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist to localStorage whenever episode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentEpisode) {
        localStorage.setItem('currentEpisode', JSON.stringify(currentEpisode));
      } else {
        localStorage.removeItem('currentEpisode');
      }
    }
  }, [currentEpisode]);

  const setCurrentEpisode = (episode) => {
    setCurrentEpisodeState(episode);
  };

  const value = {
    currentEpisode,
    setCurrentEpisode,
    isPlaying: !!currentEpisode // Simple way to track play state
  };

  return (
    <PlaybackContext.Provider value={value}>
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
}
