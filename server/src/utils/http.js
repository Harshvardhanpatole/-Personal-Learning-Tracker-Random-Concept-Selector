export class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export function requireFields(body, fields) {
  for (const field of fields) {
    if (!body?.[field] || typeof body[field] !== 'string' || !body[field].trim()) {
      throw new ApiError(400, `${field.replace(/([A-Z])/g, ' $1')} is required.`);
    }
  }
}

export function stringValue(value, maxLength, field, { required = false } = {}) {
  if (value === undefined || value === null || value === '') {
    if (required) throw new ApiError(400, `${field} is required.`);
    return null;
  }
  if (typeof value !== 'string') throw new ApiError(400, `${field} must be text.`);
  const cleaned = value.trim();
  if (!cleaned && required) throw new ApiError(400, `${field} is required.`);
  if (cleaned.length > maxLength) throw new ApiError(400, `${field} must be at most ${maxLength} characters.`);
  return cleaned || null;
}
