requireUser("signin.html");

let user = currentUser();
if (!user) { window.location.href = "signin.html"; }

document.getElementById("user-avatar").textContent = initials(user.name || user.email);
document.getElementById("user-name-label").textContent = (user.name || user.email.split("@")[0]).split(" ")[0];
document.getElementById("account-sub").textContent = `Signed in as ${user.name || user.email} (${user.email})`;

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

function renderPlans() {
  const grid = document.getElementById("plan-grid");
  grid.innerHTML = "";
  const currentPlan = user.plan || "Free";

  Object.keys(PLANS).forEach(name => {
    const plan = PLANS[name];
    const isCurrent = name === currentPlan;
    const card = document.createElement("div");
    card.className = "plan-card" + (isCurrent ? " current" : "");
    card.innerHTML = `
      ${isCurrent ? '<div class="plan-badge">Current plan</div>' : ""}
      <h3>${name}</h3>
      <div class="plan-price">${plan.price}</div>
      <p class="plan-tagline">${plan.tagline}</p>
      <ul class="plan-features">
        ${plan.features.map(f => `<li>✓ ${f}</li>`).join("")}
      </ul>
      <button class="btn ${isCurrent ? "btn-ghost" : "btn-primary"} btn-block" ${isCurrent ? "disabled" : ""}>
        ${isCurrent ? "Your plan" : "Choose " + name}
      </button>
    `;
    if (!isCurrent) {
      card.querySelector("button").addEventListener("click", () => {
        setUserPlan(user.email, name);
        user = currentUser();
        showToast(`Switched to the ${name} plan`);
        renderPlans();
      });
    }
    grid.appendChild(card);
  });
}
renderPlans();
