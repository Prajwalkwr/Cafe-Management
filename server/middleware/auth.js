import jwt from 'jsonwebtoken';

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    return res.status(401).json({ message: 'Please sign in to continue.' });
  }
  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'Your session has ended. Please sign in again.' });
  }
}

export function requireDatabase(req, res, next) {
  if (req.app.locals.databaseReady?.()) {
    return next();
  }
  return res.status(503).json({
    message: 'Our database is temporarily unavailable. Please try again shortly.',
  });
}
