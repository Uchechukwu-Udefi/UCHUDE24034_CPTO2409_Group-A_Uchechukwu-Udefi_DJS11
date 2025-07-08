import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPreviews, genreMap } from '../../server';
import Loading from './LoadingSpinner';

let cachedPreviews = null;

// Client-side search function
async function searchShows(query) {
  if (!query) return [];
  if (!cachedPreviews) {
    cachedPreviews = await fetchPreviews();
  }

  return cachedPreviews.filter(show => {
    const titleMatch = show.title.toLowerCase().includes(query.toLowerCase());

    const genreMatch = (show.genres || []).some(g =>
      genreMap[g]?.toLowerCase().includes(query.toLowerCase())
    );

    return titleMatch || genreMatch;
  });
}

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce + fetch filtered results
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim() !== '') {
        setLoading(true);
        setError(null);
        searchShows(query)
          .then(data => setResults(data))
          .catch(() => setError("Failed to fetch results"))
          .finally(() => setLoading(false));
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  const resultGenres = Array.from(new Set(results.flatMap(show => show.genres || [])));

  return (
    <div className="search-container">
      <h1>Search Shows</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing to search..."
        className="search-input"
      />

      {loading && <Loading />}
      {error && <p className="search-error-text">{error}</p>}

      {results.length > 0 && (
        <>
          <div className="search-genres-section">
            <h2>Genres Found in Results</h2>
            <div className="search-genre-list">
              {resultGenres.map((genreId) => (
                <Link to={`/genre/${genreId}`} key={genreId} className="search-genre-tag">
                  {genreMap[genreId]}
                </Link>
              ))}
            </div>
          </div>

          <div className="search-results-section">
            <h2>Search Results</h2>
            {results.map((show) => (
              <Link to={`/shows/${show.id}`} key={show.id} className="search-show-item">
                <img src={show.image} alt={show.title} className="search-show-image" />
                <div className="search-show-details">
                  <div className="search-show-title">{show.title}</div>
                  <div className="search-show-genres">
                    Genres: {(show.genres || []).map(id => genreMap[id]).join(', ')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {query.trim() !== '' && !loading && results.length === 0 && (
        <p className="search-no-results">
          No results found for <strong>{query}</strong>.
        </p>
      )}
    </div>
  );
}
