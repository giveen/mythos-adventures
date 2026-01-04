// dbService.js — client-side API wrapper

const API_BASE = "http://localhost:3001"; // adjust if needed

export async function getCharacters() {
  const res = await fetch(`${API_BASE}/api/characters`);
  return res.json();
}

export async function createCharacter(data) {
  const res = await fetch(`${API_BASE}/api/characters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function updateCharacter(id, data) {
  const res = await fetch(`${API_BASE}/api/characters/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteCharacter(id) {
  const res = await fetch(`${API_BASE}/api/characters/${id}`, {
    method: "DELETE"
  });
  return res.json();
}
