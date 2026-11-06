import { pool } from '../config/db.js';
import { findOwnedProject } from './projectController.js';
import { ApiError, asyncHandler, stringValue } from '../utils/http.js';

export const listConcepts = asyncHandler(async (req, res) => {
  await findOwnedProject(req.params.id, req.user.id);
  const { rows } = await pool.query('SELECT id, project_id, name, status, created_at, completed_at FROM concepts WHERE project_id = $1 ORDER BY CASE status WHEN \'LEARNING\' THEN 0 WHEN \'PENDING\' THEN 1 ELSE 2 END, created_at ASC', [req.params.id]);
  res.json({ concepts: rows });
});

export const createConcept = asyncHandler(async (req, res) => {
  await findOwnedProject(req.params.id, req.user.id);
  const name = stringValue(req.body.name, 160, 'Concept name', { required: true });
  try {
    const { rows } = await pool.query("INSERT INTO concepts (project_id, name, status) VALUES ($1, $2, 'PENDING') RETURNING *", [req.params.id, name]);
    await pool.query('UPDATE projects SET updated_at = NOW() WHERE id = $1', [req.params.id]);
    res.status(201).json({ concept: rows[0] });
  } catch (error) {
    if (error.code === '23505') throw new ApiError(409, 'This concept already exists in the project.');
    throw error;
  }
});

export const deleteConcept = asyncHandler(async (req, res) => {
  const result = await pool.query(`DELETE FROM concepts c USING projects p
    WHERE c.id = $1 AND c.project_id = p.id AND p.user_id = $2 AND c.status = 'PENDING' RETURNING c.project_id`, [req.params.id, req.user.id]);
  if (!result.rowCount) throw new ApiError(404, 'Pending concept not found. Only pending concepts can be removed.');
  await pool.query('UPDATE projects SET updated_at = NOW() WHERE id = $1', [result.rows[0].project_id]);
  res.status(204).send();
});

export const spin = asyncHandler(async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const project = await findOwnedProject(req.params.id, req.user.id, client);
    await client.query('SELECT id FROM projects WHERE id = $1 FOR UPDATE', [project.id]);
    const active = await client.query("SELECT id, name FROM concepts WHERE project_id = $1 AND status = 'LEARNING'", [project.id]);
    if (active.rows[0]) throw new ApiError(409, 'Complete the current concept before spinning again.');
    const pending = await client.query("SELECT id FROM concepts WHERE project_id = $1 AND status = 'PENDING' ORDER BY RANDOM() LIMIT 1 FOR UPDATE SKIP LOCKED", [project.id]);
    if (!pending.rows[0]) throw new ApiError(409, 'There are no pending concepts to select.');
    const selected = await client.query("UPDATE concepts SET status = 'LEARNING' WHERE id = $1 RETURNING id, project_id, name, status, created_at, completed_at", [pending.rows[0].id]);
    await client.query('UPDATE projects SET updated_at = NOW() WHERE id = $1', [project.id]);
    await client.query('COMMIT');
    res.json({ concept: selected.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') throw new ApiError(409, 'A concept is already being learned in this project.');
    throw error;
  } finally { client.release(); }
});

export const complete = asyncHandler(async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const query = `SELECT c.id, c.project_id FROM concepts c JOIN projects p ON p.id = c.project_id
      WHERE c.id = $1 AND p.user_id = $2 FOR UPDATE`;
    const owned = await client.query(query, [req.params.id, req.user.id]);
    if (!owned.rows[0]) throw new ApiError(404, 'Concept not found.');
    const updated = await client.query("UPDATE concepts SET status = 'COMPLETED', completed_at = NOW() WHERE id = $1 AND status = 'LEARNING' RETURNING *", [req.params.id]);
    if (!updated.rows[0]) throw new ApiError(409, 'Only the currently learning concept can be marked done.');
    await client.query('UPDATE projects SET updated_at = NOW() WHERE id = $1', [owned.rows[0].project_id]);
    await client.query('COMMIT');
    res.json({ concept: updated.rows[0] });
  } catch (error) { await client.query('ROLLBACK'); throw error; } finally { client.release(); }
});
