const inputEl = document.querySelector("#input-el");
const list = document.querySelector("#leads");
const saveTab = document.querySelector("#tab-btn");
const deleteBtn = document.querySelector("#delete-btn");
const statusEl = document.querySelector("#status");
const key = "leads-ledger.v1";
let myLeads = [];
let confirmDelete = false;

function website(value) {
  const raw = value.trim();
  if (!raw || /\s/.test(raw)) return null;
  try {
    const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(raw);
    const url = new URL(hasScheme ? raw : "https://" + raw);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return null;
    if (!url.hostname.includes(".") && url.hostname !== "localhost") return null;
    return url.href;
  } catch {
    return null;
  }
}

function readLeads() {
  const saved = JSON.parse(localStorage.getItem(key) || "[]");
  if (!Array.isArray(saved)) throw new Error("Invalid list");
  return saved.filter(url => typeof url === "string" && website(url) === url);
}

function render(leads) {
  list.replaceChildren();
  for (const url of leads) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = url;
    link.textContent = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    item.append(link);
    list.append(item);
  }
  document.querySelector("#count").textContent = leads.length;
  document.querySelector("#empty").hidden = leads.length > 0;
  document.querySelector("#delete-hint").hidden = leads.length === 0;
  deleteBtn.disabled = leads.length === 0;
  confirmDelete = false;
}

function save(value) {
  const url = website(value);
  if (!url) {
    statusEl.textContent = "Enter a website address, like example.com.";
    return false;
  }
  try {
    const current = readLeads();
    if (current.includes(url)) {
      render(current);
      statusEl.textContent = "You already saved that link.";
      return false;
    }
    myLeads = [...current, url];
    localStorage.setItem(key, JSON.stringify(myLeads));
    render(myLeads);
    statusEl.textContent = "Link saved.";
    return true;
  } catch {
    statusEl.textContent = "Couldn’t save this link. Check your browser’s storage settings.";
    return false;
  }
}

document.querySelector("#lead-form").addEventListener("submit", event => {
  event.preventDefault();
  if (save(inputEl.value)) inputEl.value = "";
  inputEl.focus();
});

const inPopup = location.protocol === "chrome-extension:" && !!globalThis.chrome?.tabs?.query;
document.documentElement.classList.toggle("popup", inPopup);
saveTab.disabled = !inPopup;
document.querySelector("#demo-note").hidden = inPopup;
saveTab.addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (tab?.url && website(tab.url)) save(tab.url);
    else statusEl.textContent = "Open a regular website, then try Save tab again.";
  } catch {
    statusEl.textContent = "Couldn’t read this tab. Open the extension from the toolbar and try again.";
  }
});

function clearLeads() {
  try {
    localStorage.removeItem(key);
    myLeads = [];
    render(myLeads);
    statusEl.textContent = "Saved leads cleared.";
  } catch {
    statusEl.textContent = "Couldn’t clear the list. Check your browser’s storage settings.";
  }
}
deleteBtn.addEventListener("dblclick", clearLeads);
deleteBtn.addEventListener("click", event => {
  if (event.detail === 0 && confirmDelete) return clearLeads();
  confirmDelete = event.detail === 0;
  statusEl.textContent = confirmDelete ? "Press again to delete all leads." : "Double-click to delete all leads.";
});
deleteBtn.addEventListener("blur", () => { confirmDelete = false; });
function refresh() {
  try {
    myLeads = readLeads();
    render(myLeads);
  } catch {
    statusEl.textContent = "Couldn’t read the saved list from browser storage.";
  }
}
window.addEventListener("storage", event => { if (event.key === key || event.key === null) refresh(); });
refresh();
