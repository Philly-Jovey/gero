const ADMIN_STORAGE_KEY = "gadr-admin-state";
const ADMIN_SESSION_KEY = "gadr-admin-session";
const managedPages = [
  { key: "index.html", name: "Home" },
  { key: "training.html", name: "Training" },
  { key: "registration.html", name: "Registration" },
  { key: "payments.html", name: "Payments" },
  { key: "About.html", name: "About Us" }
];

const defaultAdminState = {
  users: [
    { name: "Master", email: "abigabaphilly06@gmail.com", password: "GADR-MASTER", role: "Master", active: true },
    { name: "Editor slot 1", email: "editor1@gadr.org", role: "Editor", active: true },
    { name: "Editor slot 2", email: "editor2@gadr.org", role: "Editor", active: true }
  ],
  content: {
    "home.heroTitle": "Welcome to G'ADR Gerontology Training.",
    "home.heroText": "Empowering arbitrators and mediators with knowledge, skills, and confidence to serve older adults in communities across Ugand"
  },
  images: {},
  pages: {}
};

function getAdminState() {
  try {
    const state = { ...defaultAdminState, ...JSON.parse(localStorage.getItem(ADMIN_STORAGE_KEY) || "{}") };
    const master = state.users.find((user) => user.role === "Master");
    let migrated = false;
    if (master) {
      if (master.email === "master@gadr.org") { master.email = "abigabaphilly06@gmail.com"; migrated = true; }
      if (!master.password) { master.password = "GADR-MASTER"; migrated = true; }
    }
    if (migrated) localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(state));
    return state;
  } catch (error) {
    return structuredClone(defaultAdminState);
  }
}

function saveAdminState(state) {
  localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("gadr-admin-updated"));
}

function applyAdminContent() {
  const state = getAdminState();
  document.querySelectorAll("[data-admin-key]").forEach((element) => {
    const value = state.content[element.dataset.adminKey];
    if (value) element.textContent = value;
  });
  document.querySelectorAll("[data-admin-image]").forEach((element) => {
    const value = state.images[element.dataset.adminImage];
    if (value) element.style.backgroundImage = `url("${value}")`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyAdminContent();
  const login = document.getElementById("admin-login");
  const app = document.getElementById("admin-app");
  if (!login || !app) return;

  const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
  const showApp = () => { login.remove(); app.hidden = false; renderAdminApp(); };

  login.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("admin-email").value.trim().toLowerCase();
    const password = document.getElementById("admin-password").value;
    const master = getAdminState().users.find((user) => user.email === email && user.password === password && user.role === "Master" && user.active);
    if (!master) {
      document.getElementById("admin-login-message").textContent = "Email or password not recognised.";
      return;
    }
    sessionStorage.setItem(ADMIN_SESSION_KEY, "master");
    showApp();
  });

  document.getElementById("admin-reset-submit").addEventListener("click", () => {
    const email = document.getElementById("admin-reset-email").value.trim().toLowerCase();
    const newPassword = document.getElementById("admin-new-password").value;
    const confirmation = document.getElementById("admin-confirm-password").value;
    const state = getAdminState();
    const master = state.users.find((user) => user.role === "Master");
    const message = document.getElementById("admin-reset-message");
    if (!master || email !== master.email) { message.textContent = "Enter the Master email address."; return; }
    if (newPassword.length < 8 || newPassword !== confirmation) { message.textContent = "Passwords must match and be at least 8 characters."; return; }
    master.password = newPassword;
    saveAdminState(state);
    message.textContent = "Password reset on this browser. You can now sign in.";
    document.getElementById("admin-reset-email").value = "";
    document.getElementById("admin-new-password").value = "";
    document.getElementById("admin-confirm-password").value = "";
  });

  if (session) showApp();
});

async function renderAdminApp() {
  const state = getAdminState();
  const pageList = document.getElementById("admin-page-list");
  pageList.innerHTML = managedPages.map((page) => `<div class="flex items-center justify-between gap-4 border border-surface-container-high rounded-md p-4"><div><strong class="text-primary">${page.name}</strong><p class="text-sm text-on-surface-variant">${page.key}</p></div><div class="flex items-center gap-2"><a class="admin-button admin-button-secondary text-sm" href="${page.key}" target="_blank" rel="noopener">Open</a><button class="admin-button admin-button-primary text-sm" data-edit-page="${page.key}">Edit</button></div></div>`).join("");
  document.querySelectorAll("[data-edit-page]").forEach((button) => {
    button.onclick = () => openPageEditor(button.dataset.editPage);
  });
  document.getElementById("admin-hero-title").value = state.content["home.heroTitle"];
  document.getElementById("admin-hero-text").value = state.content["home.heroText"];
  const userList = document.getElementById("admin-user-list");
  userList.innerHTML = state.users.map((user, index) => `
    <div class="flex flex-col gap-3 border-b border-surface-container-high py-4 last:border-0 md:flex-row md:items-center md:justify-between">
      <div><strong>${user.name}</strong><p class="text-sm text-on-surface-variant">${user.email}</p></div>
      <div class="flex items-center gap-3"><span class="admin-badge ${user.role === "Master" ? "bg-primary text-white" : "bg-secondary-fixed text-on-secondary-fixed"}">${user.role}</span>
      <button class="admin-button admin-button-secondary text-sm" data-toggle-user="${index}">${user.active ? "Disable" : "Enable"}</button></div>
    </div>`).join("");

  document.getElementById("admin-save-content").onclick = () => {
    state.content["home.heroTitle"] = document.getElementById("admin-hero-title").value.trim();
    state.content["home.heroText"] = document.getElementById("admin-hero-text").value.trim();
    saveAdminState(state);
    document.getElementById("admin-save-message").textContent = "Changes published to this browser.";
  };
  document.querySelectorAll("[data-toggle-user]").forEach((button) => {
    button.onclick = () => { state.users[button.dataset.toggleUser].active = !state.users[button.dataset.toggleUser].active; saveAdminState(state); renderAdminApp(); };
  });
  document.getElementById("admin-image-upload").onchange = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => { state.images.hero = reader.result; saveAdminState(state); document.getElementById("admin-image-message").textContent = "Hero image uploaded and published."; };
    reader.readAsDataURL(file);
  };
  document.getElementById("admin-logout").onclick = () => { sessionStorage.removeItem(ADMIN_SESSION_KEY); window.location.reload(); };
}

async function openPageEditor(pageKey) {
  const page = managedPages.find((item) => item.key === pageKey);
  const editor = document.getElementById("page-editor");
  const frame = document.getElementById("admin-page-frame");
  const state = getAdminState();
  document.getElementById("admin-page-editor-title").textContent = `Edit ${page.name}`;
  document.getElementById("admin-page-preview").href = pageKey;
  frame.onload = () => {
    const frameDocument = frame.contentDocument;
    frameDocument.body.contentEditable = "true";
    frameDocument.body.spellcheck = true;
    frameDocument.body.classList.add("admin-visual-editing");
    if (state.pages[pageKey]) frameDocument.body.innerHTML = state.pages[pageKey];
  };
  frame.src = pageKey;
  editor.hidden = false;
  editor.scrollIntoView({ behavior: "smooth", block: "start" });
  document.getElementById("admin-save-page").onclick = () => {
    state.pages[pageKey] = frame.contentDocument.body.innerHTML;
    saveAdminState(state);
    document.getElementById("admin-page-message").textContent = "Page published to this browser.";
  };
  document.getElementById("admin-cancel-page").onclick = () => { editor.hidden = true; frame.src = "about:blank"; };
}