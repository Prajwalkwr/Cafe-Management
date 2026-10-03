import rateLimit from 'express-rate-limit';

function limiter(max, message) {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
  });
}

export const reservationLimiter = limiter(
  8,
  'Too many reservation attempts. Please wait a few minutes and try again.',
);

export const loginLimiter = limiter(
  10,
  'Too many sign-in attempts. Please wait a few minutes and try again.',
);
