const BASE_URL = 'https://podcast-api.netlify.app';

export async function fetchPreviews() {
  const res = await fetch(`${BASE_URL}`);
  if (!res.ok) throw new Error('Failed to fetch previews');
  return res.json();
}

export async function fetchGenreById(genreId) {
  const res = await fetch(`${BASE_URL}/genre/${genreId}`);
  if (!res.ok) throw new Error(`Failed to fetch genre with ID: ${genreId}`);
  return res.json();
}

export async function fetchShowById(showId) {
  const res = await fetch(`${BASE_URL}/id/${showId}`);
  if (!res.ok) throw new Error(`Failed to fetch show with ID: ${showId}`);
  return res.json();
}