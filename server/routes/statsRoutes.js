import { Router } from 'express';
import { getStats } from '../controllers/statsController.js';
import { requireAdmin, requireDatabase } from '../middleware/auth.js';

const router = Router();

router.get('/stats', requireDatabase, requireAdmin, getStats);

export default router;
