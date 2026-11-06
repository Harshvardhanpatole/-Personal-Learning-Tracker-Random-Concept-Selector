import { ApiError } from '../utils/http.js';

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const uuidParam = (name) => (req, _res, next) => {
  if (!uuidPattern.test(req.params[name])) return next(new ApiError(400, `Invalid ${name}.`));
  next();
};
