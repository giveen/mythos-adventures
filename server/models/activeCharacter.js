const db = require("./characterModel");

let activeCharacterId = null;

function setActiveCharacter(id) {
  activeCharacterId = id;
}

function getActiveCharacter() {
  if (!activeCharacterId) return null;
  return db.getCharacter(activeCharacterId);
}

module.exports = {
  setActiveCharacter,
  getActiveCharacter
};
