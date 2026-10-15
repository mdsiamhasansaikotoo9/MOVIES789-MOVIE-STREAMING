/* Layers admin-added / admin-deleted movies on top of the static MOVIES seed data,
   all persisted in localStorage so the admin console feels real. */

const CATALOG_STORE = { extra: "m789_movies_extra", deleted: "m789_movies_deleted" };

function getExtraMovies() { return readJSON(CATALOG_STORE.extra, []); }
function getDeletedIds() { return readJSON(CATALOG_STORE.deleted, []); }

function getCatalog() {
  const deleted = getDeletedIds();
  const base = MOVIES.filter(m => !deleted.includes(m.id));
  return [...base, ...getExtraMovies()];
}

function nextMovieId() {
  const all = [...MOVIES, ...getExtraMovies()];
  return Math.max(0, ...all.map(m => m.id)) + 1;
}

function addMovie(movie) {
  const extra = getExtraMovies();
  extra.push(movie);
  writeJSON(CATALOG_STORE.extra, extra);
}

function deleteMovie(id) {
  const extra = getExtraMovies();
  if (extra.some(m => m.id === id)) {
    writeJSON(CATALOG_STORE.extra, extra.filter(m => m.id !== id));
    return;
  }
  const deleted = getDeletedIds();
  if (!deleted.includes(id)) {
    deleted.push(id);
    writeJSON(CATALOG_STORE.deleted, deleted);
  }
}

function catalogGenreCounts() {
  const counts = {};
  GENRES.forEach(g => counts[g] = 0);
  getCatalog().forEach(m => m.genres.forEach(g => { counts[g] = (counts[g] || 0) + 1; }));
  return counts;
}
