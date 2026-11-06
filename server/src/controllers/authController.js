import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';
import { ApiError, asyncHandler, stringValue } from '../utils/http.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cookieOptions = { httpOnly: true, secure: env.nodeEnv === 'production', sameSite: 'lax', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 };
const publicUser = (row) => ({ id: row.id, name: row.name, email: row.email });

function setSession(res, user) {
  const token = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, { expiresIn: '7d' });
  res.cookie(env.cookieName, token, cookieOptions);
}

export const register = asyncHandler(async (req, res) => {
  const name = stringValue(req.body.name, 100, 'Name', { required: true });
  const email = stringValue(req.body.email, 254, 'Email', { required: true })?.toLowerCase();
  const password = req.body.password;
  if (!emailPattern.test(email)) throw new ApiError(400, 'Enter a valid email address.');
  if (typeof password !== 'string' || password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters.');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await client.query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email', [name, email, passwordHash]);
    const user = rows[0];
    if (env.seedProjects) {
      await client.query(`INSERT INTO projects (user_id, name, description, icon) VALUES
        ($1, 'Java Learning', 'Build a strong Java foundation.', 'Code2'),
        ($1, 'Finance Learning', 'Learn practical personal finance.', 'Landmark')`, [user.id]);
    }
    await client.query('COMMIT');
    setSession(res, user);
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') throw new ApiError(409, 'An account with this email already exists.');
    throw error;
  } finally { client.release(); }
});

export const login = asyncHandler(async (req, res) => {
  const email = stringValue(req.body.email, 254, 'Email', { required: true })?.toLowerCase();
  const password = req.body.password;
  if (typeof password !== 'string') throw new ApiError(400, 'Password is required.');
  const { rows } = await pool.query('SELECT id, name, email, password_hash FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash))) throw new ApiError(401, 'Invalid email or password.');
  setSession(res, user);
  res.json({ user: publicUser(user) });
});

export const logout = (_req, res) => { res.clearCookie(env.cookieName, { httpOnly: true, secure: env.nodeEnv === 'production', sameSite: 'lax', path: '/' }); res.status(204).send(); };

export const me = asyncHandler(async (req, res) => {
  const { rows } = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [req.user.id]);
  if (!rows[0]) throw new ApiError(401, 'User account no longer exists.');
  res.json({ user: publicUser(rows[0]) });
});
