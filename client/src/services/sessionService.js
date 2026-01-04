const STORAGE_KEY = "mythos_session_messages";

let messages = [];

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (err) {
    console.warn("Failed to load session messages from localStorage", err);
  }
  return [];
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (err) {
    console.warn("Failed to save session messages to localStorage", err);
  }
}

// initialize from storage
messages = loadFromStorage();

export function addMessage(role, content) {
  const m = { role, content, timestamp: new Date().toISOString() };
  messages.push(m);
  saveToStorage();
}

export function getMessages() {
  return [...messages];
}

export function clearMessages() {
  messages.length = 0;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to clear session messages from localStorage", err);
  }
}

const sessionService = { addMessage, getMessages, clearMessages };

export default sessionService;
