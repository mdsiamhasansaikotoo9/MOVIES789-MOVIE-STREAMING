requireUser("signin.html");

const user = currentUser();
if (!user) { window.location.href = "signin.html"; }

document.getElementById("user-avatar").textContent = initials(user.name || user.email);
document.getElementById("user-name-label").textContent = (user.name || user.email.split("@")[0]).split(" ")[0];

const userChip = document.getElementById("user-chip");
const userMenu = document.getElementById("user-menu");
userChip.addEventListener("click", (e) => { userMenu.classList.toggle("open"); e.stopPropagation(); });
document.addEventListener("click", () => userMenu.classList.remove("open"));

document.getElementById("logout-btn").addEventListener("click", () => {
  clearSession();
  window.location.href = "index.html";
});

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- Find the movie from the URL ---------- */
const movieId = Number(new URLSearchParams(location.search).get("id"));
const movie = getCatalog().find(m => m.id === movieId);

if (!movie) {
  document.querySelector("main").innerHTML = `
    <div class="empty-state" style="padding:80px 20px;">
      <div class="icon">🎞️</div>
      <h3>Title not found</h3>
      <p>It may have been removed from the catalog. <a href="home.html" style="color:var(--red);">Back to Home</a></p>
    </div>`;
  document.getElementById("movie-hero").style.display = "none";
  document.getElementById("rate-panel").style.display = "none";
  throw new Error("Movie not found");
}

/* ---------- Hero ---------- */
function renderHero() {
  const hero = document.getElementById("movie-hero");
  hero.innerHTML = `
    <img class="backdrop" src="${posterUrl(movie.seed, 1600, 900)}" alt="">
    <div class="wrap">
      <h1 class="feature-title">${movie.title}</h1>
      <div class="feature-meta">
        <span class="stars">★ ${averageRating(movie.id) ?? movie.rating}</span>
        <span>${movie.year}</span>
        <span>${movie.runtime}</span>
        <span>${movie.genres.join(" · ")}</span>
      </div>
      <p class="feature-desc">${movie.blurb}</p>
      <div class="feature-actions">
        <button class="btn btn-primary" id="hero-play">▶ Play</button>
        <button class="btn btn-outline" id="hero-wish">${isWishlisted(movie.id) ? "♥ In Wishlist" : "♡ Add to Wishlist"}</button>
      </div>
    </div>
  `;
  document.getElementById("hero-play").addEventListener("click", () => {
    bumpViews();
    showToast(`Playing "${movie.title}" (demo — no real video)`);
  });
  document.getElementById("hero-wish").addEventListener("click", (e) => {
    const active = toggleWishlist(movie.id);
    e.target.textContent = active ? "♥ In Wishlist" : "♡ Add to Wishlist";
    showToast(active ? "Added to your wishlist" : "Removed from your wishlist");
  });
}
renderHero();

/* ---------- Star picker ---------- */
let selectedStars = 0;
const starButtons = document.querySelectorAll("#star-input button");
const starValue = document.getElementById("star-value");
starButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    selectedStars = Number(btn.dataset.star);
    paintStars();
  });
  btn.addEventListener("mouseenter", () => paintStars(Number(btn.dataset.star)));
});
document.getElementById("star-input").addEventListener("mouseleave", () => paintStars());

function paintStars(hoverValue) {
  const value = hoverValue ?? selectedStars;
  starButtons.forEach(btn => {
    btn.classList.toggle("filled", Number(btn.dataset.star) <= value);
  });
  starValue.textContent = selectedStars ? `${selectedStars} / 5` : "";
}
paintStars();

/* ---------- Review form ---------- */
document.getElementById("review-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const comment = document.getElementById("review-text").value.trim();
  const note = document.getElementById("review-note");

  if (selectedStars === 0) {
    note.textContent = "Pick a star rating first.";
    return;
  }
  if (!comment) return;

  addReview(movie.id, { author: user.name || user.email.split("@")[0], rating: selectedStars, comment });
  document.getElementById("review-text").value = "";
  selectedStars = 0;
  paintStars();
  note.textContent = "";
  showToast("Review posted — thanks!");
  renderHero();
  renderReviews();
});

/* ---------- Review list ---------- */
function renderReviews() {
  const list = getReviews(movie.id);
  const container = document.getElementById("review-list");
  const empty = document.getElementById("reviews-empty");
  const avg = document.getElementById("reviews-avg");
  const heading = document.getElementById("reviews-heading");

  heading.textContent = `Reviews (${list.length})`;
  avg.textContent = list.length ? `★ ${averageRating(movie.id)} average` : "";

  container.innerHTML = "";
  if (list.length === 0) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  list.forEach(r => {
    const date = new Date(r.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    const card = document.createElement("div");
    card.className = "review-card";
    card.innerHTML = `
      <div class="review-head">
        <span class="avatar" style="width:32px;height:32px;font-size:0.82rem;">${initials(r.author)}</span>
        <div>
          <div class="review-author">${r.author}</div>
          <div class="review-date">${date}</div>
        </div>
        <div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
      </div>
      <p class="review-comment">${r.comment}</p>
    `;
    container.appendChild(card);
  });
}
renderReviews();
