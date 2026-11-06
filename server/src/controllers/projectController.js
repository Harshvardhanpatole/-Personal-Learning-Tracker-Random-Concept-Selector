import { pool } from '../config/db.js';
import { ApiError, asyncHandler, stringValue } from '../utils/http.js';

async function findOwnedProject(id, userId, client = pool) {
  const { rows } = await client.query('SELECT * FROM projects WHERE id = $1 AND user_id = $2', [id, userId]);
  if (!rows[0]) throw new ApiError(404, 'Project not found.');
  return rows[0];
}

export const listProjects = asyncHandler(async (req, res) => {
  const { rows } = await pool.query(`SELECT p.*, COUNT(c.id)::int AS concept_count,
    COUNT(c.id) FILTER (WHERE c.status = 'PENDING')::int AS pending_count,
    COUNT(c.id) FILTER (WHERE c.status = 'LEARNING')::int AS learning_count,
    COUNT(c.id) FILTER (WHERE c.status = 'COMPLETED')::int AS completed_count
    FROM projects p LEFT JOIN concepts c ON c.project_id = p.id
    WHERE p.user_id = $1 GROUP BY p.id ORDER BY p.updated_at DESC`, [req.user.id]);
  res.json({ projects: rows });
});

export const createProject = asyncHandler(async (req, res) => {
  const name = stringValue(req.body.name, 100, 'Project name', { required: true });
  const description = stringValue(req.body.description, 500, 'Description');
  const icon = stringValue(req.body.icon, 32, 'Icon') || 'BookOpen';
  const { rows } = await pool.query('INSERT INTO projects (user_id, name, description, icon) VALUES ($1, $2, $3, $4) RETURNING *', [req.user.id, name, description, icon]);
  res.status(201).json({ project: rows[0] });
});

export const getProject = asyncHandler(async (req, res) => res.json({ project: await findOwnedProject(req.params.id, req.user.id) }));

export const updateProject = asyncHandler(async (req, res) => {
  await findOwnedProject(req.params.id, req.user.id);
  const name = stringValue(req.body.name, 100, 'Project name', { required: true });
  const description = stringValue(req.body.description, 500, 'Description');
  const icon = stringValue(req.body.icon, 32, 'Icon') || 'BookOpen';
  const { rows } = await pool.query('UPDATE projects SET name = $1, description = $2, icon = $3, updated_at = NOW() WHERE id = $4 AND user_id = $5 RETURNING *', [name, description, icon, req.params.id, req.user.id]);
  res.json({ project: rows[0] });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const result = await pool.query('DELETE FROM projects WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
  if (!result.rowCount) throw new ApiError(404, 'Project not found.');
  res.status(204).send();
});

export { findOwnedProject };
