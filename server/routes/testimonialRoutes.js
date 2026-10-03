import { Router } from 'express';
import { listTestimonials } from '../controllers/testimonialController.js';
import { requireDatabase } from '../middleware/auth.js';

const router = Router();

router.get('/', requireDatabase, listTestimonials);

export default router;
