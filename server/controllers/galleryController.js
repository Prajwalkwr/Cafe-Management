import GalleryItem from '../models/GalleryItem.js';
import { cleanString, gallerySchema, parseAvailable, zodFieldErrors } from '../../shared/validation.js';
import { removeUpload } from '../middleware/upload.js';

function present(item) {
  return {
    id: item._id,
    title: item.title,
    alt: item.alt,
    image: item.image,
    visible: item.visible,
    order: item.order,
  };
}

export async function listGallery(req, res, next) {
  try {
    const items = await GalleryItem.find({ visible: true }).sort({ order: 1, createdAt: 1 });
    return res.json({ items: items.map(present) });
  } catch (error) {
    return next(error);
  }
}

export async function listManagedGallery(req, res, next) {
  try {
    const items = await GalleryItem.find().sort({ order: 1, createdAt: 1 });
    return res.json({ items: items.map(present) });
  } catch (error) {
    return next(error);
  }
}

export async function createGalleryItem(req, res, next) {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : cleanString(req.body?.image, 240);
    const parsed = gallerySchema.safeParse({
      title: cleanString(req.body?.title, 80),
      alt: cleanString(req.body?.alt, 180),
      image,
      visible: parseAvailable(req.body?.visible, true),
      order: req.body?.order ?? 0,
    });
    if (!parsed.success) {
      if (req.file) removeUpload(`/uploads/${req.file.filename}`);
      return res.status(400).json({
        message: 'Please check the gallery photo and try again.',
        errors: zodFieldErrors(parsed.error),
      });
    }
    const item = await GalleryItem.create(parsed.data);
    return res.status(201).json({ item: present(item) });
  } catch (error) {
    return next(error);
  }
}

export async function updateGalleryItem(req, res, next) {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      if (req.file) removeUpload(`/uploads/${req.file.filename}`);
      return res.status(404).json({ message: 'That gallery photo could not be found.' });
    }
    const image = req.file ? `/uploads/${req.file.filename}` : cleanString(req.body?.image, 240) || item.image;
    const parsed = gallerySchema.safeParse({
      title: cleanString(req.body?.title ?? item.title, 80),
      alt: cleanString(req.body?.alt ?? item.alt, 180),
      image,
      visible: parseAvailable(req.body?.visible, item.visible),
      order: req.body?.order ?? item.order,
    });
    if (!parsed.success) {
      if (req.file) removeUpload(`/uploads/${req.file.filename}`);
      return res.status(400).json({
        message: 'Please check the gallery photo and try again.',
        errors: zodFieldErrors(parsed.error),
      });
    }
    const previous = item.image;
    Object.assign(item, parsed.data);
    await item.save();
    if (req.file && previous !== item.image) removeUpload(previous);
    return res.json({ item: present(item) });
  } catch (error) {
    return next(error);
  }
}

export async function deleteGalleryItem(req, res, next) {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'That gallery photo could not be found.' });
    const image = item.image;
    await item.deleteOne();
    removeUpload(image);
    return res.json({ message: 'Gallery photo removed.' });
  } catch (error) {
    return next(error);
  }
}
