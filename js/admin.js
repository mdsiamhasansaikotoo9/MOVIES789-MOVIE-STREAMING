requireAdmin("login.html");

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------- Sidebar nav / view switching ---------- */
const navItems = document.querySelectorAll(".admin-nav a[data-view]");
const tableLinks = document.querySelectorAll("[data-view='movies'].table-link");
const sections = document.querySelectorAll(".view-section");

function goToView(view) {
  navItems.forEach(a => a.classList.toggle("active", a.dataset.view === view));
  sections.forEach(s => s.classList.toggle("active", s.id === `view-${view}`));
  document.getElementById("admin-sidebar").classList.remove("open");
  if (view === "dashboard") renderDashboard();
  if (view === "movies") renderMoviesTable();
  if (view === "categories") renderCategories();
  if (view === "users") renderUsers();
  if (view === "add-movie") buildGenreCheckboxes();
}

document.querySelectorAll("[data-view]").forEach(el => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    goToView(el.dataset.view);
  });
});

document.getElementById("logout-btn").addEventListener("click", () => {
  clearSession();
  window.location.href = "login.html";
});

document.getElementById("sidebar-toggle")?.addEventListener("click", () => {
  document.getElementById("admin-sidebar").classList.toggle("open");
});

/* ---------- Dashboard ---------- */
function renderDashboard() {
  const catalog = getCatalog();
  document.getElementById("stat-movies").textContent = catalog.length;
  document.getElementById("stat-users").textContent = getUsers().length;
  document.getElementById("stat-genres").textContent = GENRES.length;
  document.getElementById("stat-wishlist").textContent = getWishlist().length;
  document.getElementById("stat-views").textContent = getViews().toLocaleString();
  document.getElementById("stat-reviews").textContent = totalReviewCount();

  const counts = catalogGenreCounts();
  const max = Math.max(1, ...Object.values(counts));
  const chart = document.getElementById("genre-chart");
  chart.innerHTML = "";
  GENRES.forEach(g => {
    const value = counts[g] || 0;
    const col = document.createElement("div");
    col.className = "bar-col";
    col.innerHTML = `
      <div class="bar-count">${value}</div>
      <div class="bar" style="height:${(value / max) * 100}%;"></div>
      <div class="bar-label">${g}</div>
    `;
    chart.appendChild(col);
  });

  const body = document.getElementById("latest-titles-body");
  body.innerHTML = "";
  [...catalog].slice(-5).reverse().forEach(m => {
    body.innerHTML += `
      <tr>
        <td class="row-title"><img class="thumb" src="${posterUrl(m.seed, 88, 120)}" alt=""> ${m.title}</td>
        <td class="muted">${m.genres.join(", ")}</td>
        <td class="muted">${m.year}</td>
        <td class="muted">★ ${m.rating}</td>
      </tr>
    `;
  });
}

/* ---------- Movies table ---------- */
function renderMoviesTable() {
  const catalog = getCatalog();
  document.getElementById("movies-count").textContent = `${catalog.length} title${catalog.length === 1 ? "" : "s"}`;
  const body = document.getElementById("movies-table-body");
  body.innerHTML = "";
  catalog.forEach(m => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="row-title"><img class="thumb" src="${posterUrl(m.seed, 88, 120)}" alt=""> ${m.title}</td>
      <td class="muted">${m.genres.join(", ")}</td>
      <td class="muted">${m.year}</td>
      <td class="muted">★ ${m.rating}</td>
      <td style="text-align:right;"><button class="icon-btn danger" title="Delete">🗑</button></td>
    `;
    row.querySelector(".icon-btn").addEventListener("click", () => {
      if (confirm(`Remove "${m.title}" from the catalog?`)) {
        deleteMovie(m.id);
        renderMoviesTable();
        showToast(`Removed "${m.title}"`);
      }
    });
    body.appendChild(row);
  });
}

/* ---------- Categories ---------- */
function renderCategories() {
  const counts = catalogGenreCounts();
  const body = document.getElementById("categories-table-body");
  body.innerHTML = "";
  GENRES.forEach(g => {
    body.innerHTML += `<tr><td class="row-title">${g}</td><td class="muted">${counts[g] || 0} titles</td></tr>`;
  });
}

/* ---------- Users ---------- */
function renderUsers() {
  const users = getUsers();
  const body = document.getElementById("users-table-body");
  const table = document.getElementById("users-table");
  const empty = document.getElementById("users-empty");
  body.innerHTML = "";
  if (users.length === 0) {
    table.style.display = "none";
    empty.style.display = "block";
    return;
  }
  table.style.display = "table";
  empty.style.display = "none";
  users.forEach(u => {
    const joined = new Date(u.joined).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    body.innerHTML += `<tr><td class="row-title">${u.name}</td><td class="muted">${u.email}</td><td class="muted">${u.plan || "Free"}</td><td class="muted">${joined}</td></tr>`;
  });
}

/* ---------- Add movie ---------- */
function buildGenreCheckboxes() {
  const wrap = document.getElementById("genre-checkboxes");
  if (wrap.dataset.built) return;
  wrap.innerHTML = GENRES.map(g => `
    <label class="checkbox-pill">
      <input type="checkbox" value="${g}"> ${g}
    </label>
  `).join("");
  wrap.dataset.built = "1";
}

document.getElementById("add-movie-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("m-title").value.trim();
  const year = Number(document.getElementById("m-year").value);
  const runtime = document.getElementById("m-runtime").value.trim();
  const rating = Number(document.getElementById("m-rating").value);
  const blurb = document.getElementById("m-blurb").value.trim();
  const genres = [...document.querySelectorAll("#genre-checkboxes input:checked")].map(c => c.value);

  if (genres.length === 0) {
    showToast("Pick at least one genre");
    return;
  }

  const movie = {
    id: nextMovieId(),
    title, year, runtime, rating, genres, blurb,
    seed: title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `movie-${Date.now()}`
  };
  addMovie(movie);
  e.target.reset();
  showToast(`"${title}" added to the catalog`);
  goToView("movies");
});

/* ---------- Settings ---------- */
document.getElementById("save-settings").addEventListener("click", () => {
  showToast("Settings saved");
});

/* ---------- Init ---------- */
renderDashboard();
