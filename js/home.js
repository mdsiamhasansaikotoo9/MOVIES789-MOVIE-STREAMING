requireUser("signin.html");

const user = currentUser();
if (!user) { window.location.href = "signin.html"; }

document.getElementById("user-avatar").textContent = initials(user.name || user.email);
document.getElementById("user-name-label").textContent = (user.name || user.email.split("@")[0]).split(" ")[0];

const userChip = document.getElementById("user-chip");
const userMenu = document.getElementById("user-menu");
userChip.addEventListener("click", (e) => {
  userMenu.classList.toggle("open");
  e.stopPropagation();
});
document.addEventListener("click", () => userMenu.classList.remove("open"));

document.getElementById("logout-btn").addEventListener("click", () => {
  clearSession();
  window.location.href = "index.html";
});

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- Poster card builder ---------- */
function posterCard(movie) {
  const wished = isWishlisted(movie.id);
  const avg = averageRating(movie.id);
  const card = document.createElement("div");
  card.className = "poster";
  card.innerHTML = `
    <img src="${posterUrl(movie.seed)}" alt="${movie.title} poster" loading="lazy">
    <div class="poster-rating">★ ${avg ?? movie.rating}</div>
    <button class="poster-wish ${wished ? "active" : ""}" aria-label="Toggle wishlist">${wished ? "♥" : "♡"}</button>
    <div class="poster-meta">
      <div class="poster-title">${movie.title}</div>
      <div class="poster-sub">${movie.year} · ${movie.genres[0]}</div>
    </div>
  `;
  const goToMovie = () => { window.location.href = `movie.html?id=${movie.id}`; };
  card.querySelector("img").addEventListener("click", goToMovie);
  card.querySelector(".poster-title").addEventListener("click", goToMovie);
  const wishBtn = card.querySelector(".poster-wish");
  wishBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const active = toggleWishlist(movie.id);
    wishBtn.classList.toggle("active", active);
    wishBtn.textContent = active ? "♥" : "♡";
    showToast(active ? `Added "${movie.title}" to your wishlist` : `Removed "${movie.title}" from your wishlist`);
    if (currentBrowseView === "wishlist") renderBrowse();
  });
  return card;
}

/* ---------- Featured hero ---------- */
const featured = MOVIES[0];
function renderHero() {
  const hero = document.getElementById("feature-hero");
  hero.innerHTML = `
    <img class="backdrop" src="${posterUrl(featured.seed, 1600, 900)}" alt="">
    <div class="wrap">
      <div class="feature-badge">FEATURED FILM</div>
      <h1 class="feature-title">${featured.title}</h1>
      <div class="feature-meta">
        <span class="stars">★ ${featured.rating}</span>
        <span>${featured.year}</span>
        <span>${featured.runtime}</span>
        <span>${featured.genres.join(" · ")}</span>
      </div>
      <p class="feature-desc">${featured.blurb}</p>
      <div class="feature-actions">
        <button class="btn btn-primary" id="hero-play">▶ Play</button>
        <button class="btn btn-outline" id="hero-wish">${isWishlisted(featured.id) ? "♥ In Wishlist" : "♡ Add to Wishlist"}</button>
        <button class="btn btn-ghost" id="hero-info">ⓘ More Info</button>
      </div>
    </div>
  `;
  document.getElementById("hero-play").addEventListener("click", () => {
    bumpViews();
    showToast(`Playing "${featured.title}" (demo — no real video)`);
  });
  document.getElementById("hero-wish").addEventListener("click", (e) => {
    const active = toggleWishlist(featured.id);
    e.target.textContent = active ? "♥ In Wishlist" : "♡ Add to Wishlist";
    showToast(active ? "Added to your wishlist" : "Removed from your wishlist");
  });
  document.getElementById("hero-info").addEventListener("click", () => {
    window.location.href = `movie.html?id=${featured.id}`;
  });
}
renderHero();

/* ---------- Rows ---------- */
function renderRow(containerId, movies) {
  const track = document.getElementById(containerId);
  track.innerHTML = "";
  movies.forEach(m => track.appendChild(posterCard(m)));
}
renderRow("trending-track", [...getCatalog()].sort((a, b) => b.rating - a.rating).slice(0, 10));
renderRow("drama-track", getCatalog().filter(m => m.genres.includes("Drama")));

document.getElementById("car-next").addEventListener("click", () => {
  document.getElementById("trending-track").scrollBy({ left: 400, behavior: "smooth" });
});
document.getElementById("car-prev").addEventListener("click", () => {
  document.getElementById("trending-track").scrollBy({ left: -400, behavior: "smooth" });
});

/* ---------- Nav / views ---------- */
const mainHome = document.getElementById("main-home");
const mainBrowse = document.getElementById("main-browse");
const navLinks = document.querySelectorAll(".nav-links a");
let currentBrowseView = null;
let activeGenre = "All";
let searchTerm = "";

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    const view = link.dataset.view;
    if (view === "home") return; // normal navigation to home.html
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    showBrowse(view);
  });
});

function showBrowse(view) {
  currentBrowseView = view;
  activeGenre = "All";
  searchTerm = "";
  document.getElementById("search-input").value = "";
  mainHome.style.display = "none";
  mainBrowse.style.display = "block";

  const titles = { movies: "Movies", tv: "TV Shows", genres: "Browse by Genre", trending: "Trending Now", wishlist: "Your Wishlist" };
  document.getElementById("browse-title").textContent = titles[view] || "Movies";

  const filterBar = document.getElementById("filter-bar");
  filterBar.innerHTML = "";
  if (view === "movies" || view === "genres") {
    ["All", ...GENRES].forEach(g => {
      const chip = document.createElement("button");
      chip.className = "chip" + (g === "All" ? " active" : "");
      chip.textContent = g;
      chip.addEventListener("click", () => {
        activeGenre = g;
        filterBar.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        renderBrowse();
      });
      filterBar.appendChild(chip);
    });
  }
  renderBrowse();
}

document.getElementById("search-input").addEventListener("input", (e) => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderBrowse();
});

function renderBrowse() {
  let list;
  if (currentBrowseView === "tv") {
    list = [];
  } else if (currentBrowseView === "trending") {
    list = [...getCatalog()].sort((a, b) => b.rating - a.rating);
  } else if (currentBrowseView === "wishlist") {
    const ids = getWishlist();
    list = getCatalog().filter(m => ids.includes(m.id));
  } else {
    list = getCatalog();
    if (activeGenre !== "All") list = list.filter(m => m.genres.includes(activeGenre));
  }
  if (searchTerm) list = list.filter(m => m.title.toLowerCase().includes(searchTerm));

  const grid = document.getElementById("browse-grid");
  grid.innerHTML = "";
  document.getElementById("browse-count").textContent = list.length ? `${list.length} title${list.length === 1 ? "" : "s"}` : "";

  const emptyState = document.getElementById("empty-state");
  if (list.length === 0) {
    emptyState.style.display = "block";
    if (currentBrowseView === "tv") {
      emptyState.querySelector("h3").textContent = "No TV shows yet";
      emptyState.querySelector("p").textContent = "This demo catalog only stocks movies for now.";
    } else if (currentBrowseView === "wishlist") {
      emptyState.querySelector("h3").textContent = "Your wishlist is empty";
      emptyState.querySelector("p").textContent = "Tap the heart on any title to save it here.";
    } else {
      emptyState.querySelector("h3").textContent = "Nothing here yet";
      emptyState.querySelector("p").textContent = "Try a different genre or search term.";
    }
  } else {
    emptyState.style.display = "none";
    list.forEach(m => grid.appendChild(posterCard(m)));
  }
}
