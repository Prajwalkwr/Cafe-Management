import { Router } from 'express';
import {
  createGalleryItem,
  deleteGalleryItem,
  listGallery,
  listManagedGallery,
  updateGalleryItem,
} from '../controllers/galleryController.js';
import { requireAdmin, requireDatabase } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', requireDatabase, listGallery);
router.get('/manage', requireDatabase, requireAdmin, listManagedGallery);
router.post('/', requireDatabase, requireAdmin, upload.single('imageFile'), createGalleryItem);
router.patch('/:id', requireDatabase, requireAdmin, upload.single('imageFile'), updateGalleryItem);
router.delete('/:id', requireDatabase, requireAdmin, deleteGalleryItem);

export default router;
