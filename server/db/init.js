const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "mythos.db");
const schemaPath = path.join(__dirname, "schema.sql");

const db = new Database(dbPath);

const schema = fs.readFileSync(schemaPath, "utf8");
db.exec(schema);

// Ensure migrations for existing DBs: add `gold` column if missing
try {
	const info = db.prepare("PRAGMA table_info(characters)").all();
	const hasGold = info.some((col) => col.name === "gold");
	if (!hasGold) {
		console.log("Migrating DB: adding 'gold' column to characters table.");
		db.prepare("ALTER TABLE characters ADD COLUMN gold INTEGER DEFAULT 0").run();
	}
} catch (err) {
	console.warn("DB migration check failed:", err.message);
}

// Ensure migrations for existing DBs: add `cost_gp` column to equipment if missing
try {
  const eqInfo = db.prepare("PRAGMA table_info(equipment)").all();
  const hasCostGp = eqInfo.some((col) => col.name === "cost_gp");
  if (!hasCostGp) {
    console.log("Migrating DB: adding 'cost_gp' column to equipment table.");
    db.prepare("ALTER TABLE equipment ADD COLUMN cost_gp INTEGER").run();
  }
} catch (err) {
  console.warn("DB migration check failed (equipment):", err.message);
}

// Ensure migrations for existing DBs: add `classes` column to spells if missing
try {
	const spInfo = db.prepare("PRAGMA table_info(spells)").all();
	const hasClasses = spInfo.some((col) => col.name === "classes");
	if (!hasClasses) {
		console.log("Migrating DB: adding 'classes' column to spells table.");
		db.prepare("ALTER TABLE spells ADD COLUMN classes TEXT").run();
	}
} catch (err) {
	console.warn("DB migration check failed (spells):", err.message);
}

console.log("MythOS SQLite database initialized.");

module.exports = db;
