import { Router } from 'express';
import authRoutes from './authRoutes.js';
import reservationRoutes from './reservationRoutes.js';
import menuRoutes from './menuRoutes.js';
import galleryRoutes from './galleryRoutes.js';
import testimonialRoutes from './testimonialRoutes.js';
import statsRoutes from './statsRoutes.js';
import { notFoundHandler } from '../middleware/errorHandler.js';

const router = Router();

router.get('/health', (req, res) => {
  const ready = req.app.locals.databaseReady?.() === true;
  res.status(ready ? 200 : 503).json({
    ok: ready,
    database: ready ? 'connected' : 'unavailable',
  });
});

router.use('/auth', authRoutes);
router.use('/reservations', reservationRoutes);
router.use('/menu', menuRoutes);
router.use('/gallery', galleryRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/admin', statsRoutes);
router.use(notFoundHandler);

export default router;
