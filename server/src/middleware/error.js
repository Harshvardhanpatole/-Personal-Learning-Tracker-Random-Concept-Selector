export function notFound(_req, res) { res.status(404).json({ message: 'Route not found.' }); }

export function errorHandler(error, _req, res, _next) {
  if (error.code === '23505') return res.status(409).json({ message: 'That record already exists.' });
  if (error.code === '23503') return res.status(404).json({ message: 'Related record was not found.' });
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ message: error.message || 'Something went wrong.' });
}
