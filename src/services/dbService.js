// Database service for game application

import { Pool } from 'pg';

// Create a connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'game_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Helper function to execute queries
async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

// User management functions
export async function createUser(username, email, passwordHash) {
  const result = await query(
    'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
    [username, email, passwordHash]
  );
  return result.rows[0];
}

export async function getUserByEmail(email) {
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

// Game management functions
export async function createGame(userId, title, description = '') {
  const result = await query(
    'INSERT INTO games (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
    [userId, title, description]
  );
  return result.rows[0];
}

export async function getGameById(gameId) {
  const result = await query('SELECT * FROM games WHERE id = $1', [gameId]);
  return result.rows[0];
}

// Game session functions
export async function createGameSession(gameId, startTime, summary = '') {
  const result = await query(
    'INSERT INTO game_sessions (game_id, start_time, summary) VALUES ($1, $2, $3) RETURNING *',
    [gameId, startTime, summary]
  );
  return result.rows[0];
}

export async function updateGameSession(sessionId, updates) {
  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  if (updates.end_time !== undefined) {
    setClauses.push(`end_time = $${paramIndex++}`);
    values.push(updates.end_time);
  }

  if (updates.summary !== undefined) {
    setClauses.push(`summary = $${paramIndex++}`);
    values.push(updates.summary);
  }

  if (setClauses.length === 0) return false;

  const queryText = `UPDATE game_sessions SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;
  values.push(sessionId);

  const result = await query(queryText, values);
  return result.rows[0];
}

// Story event functions
export async function addStoryEvent(sessionId, eventType, description, importance = 3) {
  const result = await query(
    'INSERT INTO story_events (session_id, event_type, description, importance) VALUES ($1, $2, $3, $4) RETURNING *',
    [sessionId, eventType, description, importance]
  );
  return result.rows[0];
}

export async function getStoryEventsBySession(sessionId) {
  const result = await query(
    'SELECT * FROM story_events WHERE session_id = $1 ORDER BY timestamp ASC',
    [sessionId]
  );
  return result.rows;
}

// World state functions
export async function updateWorldState(gameId, key, value) {
  try {
    // Try to update existing record
    const result = await query(
      'UPDATE world_states SET value = $3, updated_at = CURRENT_TIMESTAMP WHERE game_id = $1 AND key = $2 RETURNING *',
      [gameId, key, JSON.stringify(value)]
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    // If no existing record, create new one
    const insertResult = await query(
      'INSERT INTO world_states (game_id, key, value) VALUES ($1, $2, $3) RETURNING *',
      [gameId, key, JSON.stringify(value)]
    );

    return insertResult.rows[0];
  } catch (error) {
    console.error('Error updating world state:', error);
    throw error;
  }
}

export async function getWorldState(gameId, key) {
  const result = await query(
    'SELECT value FROM world_states WHERE game_id = $1 AND key = $2',
    [gameId, key]
  );

  if (result.rows.length > 0) {
    return JSON.parse(result.rows[0].value);
  }
  return null;
}

// Quest functions
export async function createQuest(gameId, title, description = '', status = 'active') {
  const result = await query(
    'INSERT INTO quests (game_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
    [gameId, title, description, status]
  );
  return result.rows[0];
}

export async function updateQuest(questId, updates) {
  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  if (updates.title !== undefined) {
    setClauses.push(`title = $${paramIndex++}`);
    values.push(updates.title);
  }

  if (updates.description !== undefined) {
    setClauses.push(`description = $${paramIndex++}`);
    values.push(updates.description);
  }

  if (updates.status !== undefined) {
    setClauses.push(`status = $${paramIndex++}`);
    values.push(updates.status);
  }

  if (setClauses.length === 0) return false;

  const queryText = `UPDATE quests SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
  values.push(questId);

  const result = await query(queryText, values);
  return result.rows[0];
}

export async function addQuestStep(questId, stepNumber, description, completed = false) {
  const result = await query(
    'INSERT INTO quest_steps (quest_id, step_number, description, completed) VALUES ($1, $2, $3, $4) RETURNING *',
    [questId, stepNumber, description, completed]
  );
  return result.rows[0];
}

export async function updateQuestStep(stepId, updates) {
  const setClauses = [];
  const values = [];
  let paramIndex = 1;

  if (updates.description !== undefined) {
    setClauses.push(`description = $${paramIndex++}`);
    values.push(updates.description);
  }

  if (updates.completed !== undefined) {
    setClauses.push(`completed = $${paramIndex++}`);
    values.push(updates.completed);
  }

  if (setClauses.length === 0) return false;

  const queryText = `UPDATE quest_steps SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`;
  values.push(stepId);

  const result = await query(queryText, values);
  return result.rows[0];
}

// Close the pool when the application shuts down
process.on('exit', () => {
  pool.end();
});
