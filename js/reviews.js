/* Movies 789 — user ratings & written reviews.
   Stored as { [movieId]: [ {author, rating, comment, date} ] } in localStorage. */

const REVIEWS_KEY = "m789_reviews";

function getAllReviews() { return readJSON(REVIEWS_KEY, {}); }

function getReviews(movieId) {
  const all = getAllReviews();
  return all[movieId] || [];
}

function addReview(movieId, { author, rating, comment }) {
  const all = getAllReviews();
  if (!all[movieId]) all[movieId] = [];
  all[movieId].unshift({
    author,
    rating: Number(rating),
    comment,
    date: new Date().toISOString()
  });
  writeJSON(REVIEWS_KEY, all);
}

function averageRating(movieId) {
  const list = getReviews(movieId);
  if (list.length === 0) return null;
  const sum = list.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / list.length) * 10) / 10;
}

function totalReviewCount() {
  const all = getAllReviews();
  return Object.values(all).reduce((sum, list) => sum + list.length, 0);
}

function hasUserReviewed(movieId, author) {
  return getReviews(movieId).some(r => r.author.toLowerCase() === author.toLowerCase());
}
