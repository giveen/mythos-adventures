const Database = require("better-sqlite3");
const path = require("path");

// Always point explicitly to the DB in this folder
const dbPath = path.join(__dirname, "mythos.db");
const db = new Database(dbPath);

module.exports = db;
