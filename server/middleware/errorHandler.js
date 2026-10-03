export function notFoundHandler(req, res) {
  res.status(404).json({ message: 'That request could not be found.' });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'The request could not be read.' });
    return;
  }

  if (err?.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ message: 'Please upload an image smaller than 5 MB.' });
    return;
  }

  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    message:
      status >= 500
        ? 'Something went wrong on our side. Please try again shortly.'
        : err.message || 'The request could not be completed.',
  });
}
