export default function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  console.error('[errorHandler]', status, message, err.stack);
  res.status(status).json({ error: message });
}
