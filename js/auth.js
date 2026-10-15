/* Movies 789 — local "accounts" demo layer.
   Everything is stored in the browser's localStorage. Nothing leaves the device. */

const STORE = {
  users: "m789_users",
  session: "m789_session",
  wishlist: "m789_wishlist",
  views: "m789_views"
};

const ADMIN_CREDS = { username: "admin", password: "admin1234" };

const PLANS = {
  Free:    { price: "$0/mo",    tagline: "Get a feel for the catalog.", features: ["Browse the full catalog", "Rate & review titles", "1 screen at a time"] },
  Basic:   { price: "$6.99/mo", tagline: "For solo watching, upgraded.", features: ["Everything in Free", "HD playback (demo)", "2 screens at a time"] },
  Premium: { price: "$12.99/mo", tagline: "The whole household, covered.", features: ["Everything in Basic", "4K playback (demo)", "4 screens at a time", "Early access to new titles"] }
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUsers() { return readJSON(STORE.users, []); }
function saveUsers(users) { writeJSON(STORE.users, users); }

function getSession() { return readJSON(STORE.session, null); }
function setSession(session) { writeJSON(STORE.session, session); }
function clearSession() { localStorage.removeItem(STORE.session); }

function signUp(name, email, password) {
  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, error: "An account with that email already exists." };
  }
  const user = { name, email, password, plan: "Free", joined: new Date().toISOString() };
  users.push(user);
  saveUsers(users);
  setSession({ type: "user", email });
  return { ok: true };
}

function signIn(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) return { ok: false, error: "That email and password don't match an account." };
  setSession({ type: "user", email });
  return { ok: true };
}

function adminSignIn(username, password) {
  if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
    setSession({ type: "admin", username });
    return { ok: true };
  }
  return { ok: false, error: "Incorrect admin username or password." };
}

function setUserPlan(email, plan) {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  if (!user) return false;
  user.plan = plan;
  saveUsers(users);
  return true;
}

function currentUser() {
  const session = getSession();
  if (!session || session.type !== "user") return null;
  return getUsers().find(u => u.email === session.email) || null;
}

function isAdmin() {
  const session = getSession();
  return !!(session && session.type === "admin");
}

function requireUser(redirectTo = "signin.html") {
  const session = getSession();
  if (!session || session.type !== "user") {
    window.location.href = redirectTo;
  }
}

function requireAdmin(redirectTo = "login.html") {
  const session = getSession();
  if (!session || session.type !== "admin") {
    window.location.href = redirectTo;
  }
}

function getWishlist() { return readJSON(STORE.wishlist, []); }
function isWishlisted(movieId) { return getWishlist().includes(movieId); }
function toggleWishlist(movieId) {
  let list = getWishlist();
  if (list.includes(movieId)) {
    list = list.filter(id => id !== movieId);
  } else {
    list.push(movieId);
  }
  writeJSON(STORE.wishlist, list);
  return list.includes(movieId);
}

function bumpViews(by = 1) {
  const current = readJSON(STORE.views, 460995);
  writeJSON(STORE.views, current + by);
  return current + by;
}
function getViews() { return readJSON(STORE.views, 460995); }

function initials(nameOrEmail) {
  if (!nameOrEmail) return "?";
  const base = nameOrEmail.includes("@") ? nameOrEmail.split("@")[0] : nameOrEmail;
  return base.slice(0, 1).toUpperCase();
}
