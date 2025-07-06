import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPreviews, genreMap } from '../../server';

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
    <div style={{ padding: '1rem' }}>
      <h1>Search Shows</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Start typing to search..."
        style={{ padding: '0.5rem', width: '60%' }}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {results.length > 0 && (
        <>
          <div style={{ marginTop: '2rem' }}>
            <h2>Genres Found in Results</h2>
            <div className="genre-list">
              {resultGenres.map((genreId) => (
                <Link
                  to={`/genre/${genreId}`}
                  key={genreId}
                  className="genre-tag"
                  style={{
                    marginRight: '1rem',
                    display: 'inline-block',
                    textDecoration: 'none',
                    color: '#555',
                    padding: '0.4rem 0.8rem',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    background: '#f9f9f9'
                  }}
                >
                  {genreMap[genreId]}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h2>Search Results</h2>
            {results.map((show) => (
              <Link
                to={`/shows/${show.id}`}
                key={show.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  textDecoration: 'none',
                  color: '#000'
                }}
              >
                <img src={show.image} alt={show.title} style={{ width: '100px', borderRadius: '5px' }} />
                <div style={{ marginLeft: '1rem' }}>
                  <div style={{ fontWeight: 'bold' }}>{show.title}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Genres: {(show.genres || []).map(id => genreMap[id]).join(', ')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* No Results */}
      {query.trim() !== '' && !loading && results.length === 0 && (
        <p style={{ marginTop: '2rem', color: '#666', fontStyle: 'italic' }}>
          No results found for `<strong>{query}</strong>`.
        </p>
      )}
    </div>
  );
}
