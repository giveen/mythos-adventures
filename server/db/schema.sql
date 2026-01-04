PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    level INTEGER,
    school TEXT,
    casting_time TEXT,
    range TEXT,
    target TEXT,
    components TEXT,
    description TEXT,
    source TEXT,
    classes TEXT,
  class TEXT,
  race TEXT,
  background TEXT,
  alignment TEXT,

  -- Core progression
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
    gold INTEGER DEFAULT 0,
  hit_points INTEGER DEFAULT 10,
  proficiency_bonus INTEGER DEFAULT 2,

  -- JSON fields for flexible RPG systems
  stats TEXT,               -- {str, dex, con, int, wis, cha}
  inventory TEXT,           -- array of items
  skills TEXT,              -- array of skill objects
  class_features TEXT,      -- array or object
  race_traits TEXT,         -- array or object
  notes TEXT,               -- freeform player notes
  metadata TEXT,            -- GM/system metadata
  portrait TEXT,            -- base64 or URL

  createdAt TEXT,
  updatedAt TEXT
);


CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS game_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id)
);

CREATE TABLE IF NOT EXISTS story_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    event_type TEXT NOT NULL,
    description TEXT NOT NULL,
    importance INTEGER DEFAULT 3,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(id)
);

CREATE TABLE IF NOT EXISTS world_states (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    key TEXT NOT NULL,
    value TEXT NOT NULL, -- JSON stored as TEXT
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(game_id, key),
    FOREIGN KEY (game_id) REFERENCES games(id)
);

CREATE TABLE IF NOT EXISTS quests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id)
);

CREATE TABLE IF NOT EXISTS quest_steps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quest_id INTEGER NOT NULL,
    step_number INTEGER NOT NULL,
    description TEXT NOT NULL,
    completed INTEGER DEFAULT 0, -- SQLite uses 0/1 for booleans
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(quest_id, step_number),
    FOREIGN KEY (quest_id) REFERENCES quests(id)
);

CREATE INDEX IF NOT EXISTS idx_story_events_session ON story_events(session_id);
CREATE INDEX IF NOT EXISTS idx_world_states_game ON world_states(game_id);
CREATE INDEX IF NOT EXISTS idx_quests_game ON quests(game_id);

-- Equipment catalog for items, gear, and magic items
CREATE TABLE IF NOT EXISTS equipment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    cost TEXT,
    cost_gp INTEGER,
    weight REAL,
    properties TEXT, -- JSON
    description TEXT,
    source TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_equipment_name ON equipment(name);

