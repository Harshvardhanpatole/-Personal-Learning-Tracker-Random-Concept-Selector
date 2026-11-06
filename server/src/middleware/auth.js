import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/http.js';

export function authenticate(req, _res, next) {
  try {
    const token = req.cookies?.[env.cookieName];
    if (!token) throw new ApiError(401, 'Please sign in to continue.');
    req.user = jwt.verify(token, env.jwtSecret);
    next();
  } catch (error) {
    next(error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError' ? new ApiError(401, 'Your session has expired. Please sign in again.') : error);
  }
}
