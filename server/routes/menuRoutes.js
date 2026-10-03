import { Router } from 'express';
import {
  createMenuItem,
  deleteMenuItem,
  listManagedMenu,
  listMenu,
  updateMenuItem,
} from '../controllers/menuController.js';
import { requireAdmin, requireDatabase } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', requireDatabase, listMenu);
router.get('/manage', requireDatabase, requireAdmin, listManagedMenu);
router.post('/', requireDatabase, requireAdmin, upload.single('imageFile'), createMenuItem);
router.patch('/:id', requireDatabase, requireAdmin, upload.single('imageFile'), updateMenuItem);
router.delete('/:id', requireDatabase, requireAdmin, deleteMenuItem);

export default router;
