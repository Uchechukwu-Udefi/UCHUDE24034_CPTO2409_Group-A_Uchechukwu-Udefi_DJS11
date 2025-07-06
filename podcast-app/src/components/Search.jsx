import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { fetchShowById } from '../../server';


async function searchShows(query) {
  if (!query) return [];
  const response = await fetch(fetchShowById);
  if (!response.ok) throw new Error("Search failed");
  return await response.json();
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  //Debounce logic
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim() !== '') {
        setLoading(true);
        setError(null);
        searchShows(query)
          .then(data => setResults(data))
          .catch(err => setError("Failed to fetch results"))
          .finally(() => setLoading(false));
      } else {
        setResults([]);
      }
    }, 400);  //Debounce delay time

    return () => clearTimeout(delay); //Clear on re-type
  }, [query]);

  return (

  )
}