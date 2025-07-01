const BASE_URL = 'https://podcast-api.netlify.app';

/**
 * Get all podcast previews (lightweight list of shows)
 * @returns {Promise<Array>} Array of PREVIEW objects
 */
export async function fetchPreviews() {
  const res = await fetch(`${BASE_URL}`);
  if (!res.ok) throw new Error('Failed to fetch previews');
  return res.json();
}

/**
 * Get detailed genre information by ID
 * @param {string|number} genreId
 * @returns {Promise<Object>} GENRE object
 */
export async function fetchGenreById(genreId) {
  const res = await fetch(`${BASE_URL}/genre/${genreId}`);
  if (!res.ok) throw new Error(`Failed to fetch genre with ID: ${genreId}`);
  return res.json();
}

/**
 * Get full show details (including SEASONs and EPISODEs) by show ID
 * @param {string|number} showId
 * @returns {Promise<Object>} SHOW object
 */
export async function fetchShowById(showId) {
  const res = await fetch(`${BASE_URL}/id/${showId}`);
  if (!res.ok) throw new Error(`Failed to fetch show with ID: ${showId}`);
  return res.json();
}


export const genreMap = {
  1: 'Personal Growth',
  2: 'Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family',
};

