import { Router } from 'express';
import { login, me } from '../controllers/authController.js';
import { loginLimiter } from '../middleware/rateLimit.js';
import { requireAdmin, requireDatabase } from '../middleware/auth.js';

const router = Router();

router.post('/login', requireDatabase, loginLimiter, login);
router.get('/me', requireDatabase, requireAdmin, me);

export default router;
