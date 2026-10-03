import { Router } from 'express';
import {
  createReservation,
  deleteReservation,
  getReservation,
  listReservations,
  updateReservation,
} from '../controllers/reservationController.js';
import { requireAdmin, requireDatabase } from '../middleware/auth.js';
import { reservationLimiter } from '../middleware/rateLimit.js';

const router = Router();

router.post('/', requireDatabase, reservationLimiter, createReservation);
router.get('/', requireDatabase, requireAdmin, listReservations);
router.get('/:id', requireDatabase, getReservation);
router.patch('/:id', requireDatabase, requireAdmin, updateReservation);
router.delete('/:id', requireDatabase, requireAdmin, deleteReservation);

export default router;
