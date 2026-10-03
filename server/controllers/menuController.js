import MenuItem from '../models/MenuItem.js';
import { MENU_CATEGORIES } from '../../shared/site.js';
import { cleanString, menuSchema, parseAvailable, zodFieldErrors } from '../../shared/validation.js';
import { removeUpload } from '../middleware/upload.js';

function menuPayload(body, image) {
  return {
    name: cleanString(body?.name, 80),
    category: cleanString(body?.category, 40),
    description: cleanString(body?.description, 400),
    price: body?.price,
    image: image || cleanString(body?.image, 240),
    available: parseAvailable(body?.available, true),
  };
}

function present(item) {
  return {
    id: item._id,
    name: item.name,
    category: item.category,
    description: item.description,
    price: item.price,
    image: item.image,
    available: item.available,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export async function listMenu(req, res, next) {
  try {
    const filter = { available: true };
    if (req.query.category && req.query.category !== 'All') {
      if (!MENU_CATEGORIES.includes(req.query.category)) {
        return res.status(400).json({ message: 'That menu category does not exist.' });
      }
      filter.category = req.query.category;
    }
    const items = await MenuItem.find(filter).sort({ category: 1, name: 1 });
    return res.json({ items: items.map(present) });
  } catch (error) {
    return next(error);
  }
}

export async function listManagedMenu(req, res, next) {
  try {
    const items = await MenuItem.find().sort({ category: 1, name: 1 });
    return res.json({ items: items.map(present) });
  } catch (error) {
    return next(error);
  }
}

export async function createMenuItem(req, res, next) {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : '';
    const parsed = menuSchema.safeParse(menuPayload(req.body, image));
    if (!parsed.success) {
      if (req.file) removeUpload(`/uploads/${req.file.filename}`);
      return res.status(400).json({
        message: 'Please check the menu item and try again.',
        errors: zodFieldErrors(parsed.error),
      });
    }
    const item = await MenuItem.create(parsed.data);
    return res.status(201).json({ item: present(item) });
  } catch (error) {
    return next(error);
  }
}

export async function updateMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      if (req.file) removeUpload(`/uploads/${req.file.filename}`);
      return res.status(404).json({ message: 'That menu item could not be found.' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : cleanString(req.body?.image, 240) || item.image;
    const parsed = menuSchema.safeParse(
      menuPayload(
        {
          name: req.body?.name ?? item.name,
          category: req.body?.category ?? item.category,
          description: req.body?.description ?? item.description,
          price: req.body?.price ?? item.price,
          available: req.body?.available ?? item.available,
        },
        image,
      ),
    );

    if (!parsed.success) {
      if (req.file) removeUpload(`/uploads/${req.file.filename}`);
      return res.status(400).json({
        message: 'Please check the menu item and try again.',
        errors: zodFieldErrors(parsed.error),
      });
    }

    const previousImage = item.image;
    Object.assign(item, parsed.data);
    await item.save();
    if (req.file && previousImage !== item.image) removeUpload(previousImage);
    return res.json({ item: present(item) });
  } catch (error) {
    return next(error);
  }
}

export async function deleteMenuItem(req, res, next) {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'That menu item could not be found.' });
    const image = item.image;
    await item.deleteOne();
    removeUpload(image);
    return res.json({ message: 'Menu item deleted.' });
  } catch (error) {
    return next(error);
  }
}
