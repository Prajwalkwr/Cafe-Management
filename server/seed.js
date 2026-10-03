import bcrypt from 'bcryptjs';
import User from './models/User.js';
import MenuItem from './models/MenuItem.js';
import GalleryItem from './models/GalleryItem.js';
import Testimonial from './models/Testimonial.js';
import { gallerySeed, menuSeed, testimonialSeed } from './data/seedData.js';

export async function seedIfEmpty() {
  if ((await MenuItem.countDocuments()) === 0) {
    await MenuItem.insertMany(menuSeed);
  }
  if ((await GalleryItem.countDocuments()) === 0) {
    await GalleryItem.insertMany(gallerySeed.map((item) => ({ ...item, visible: true })));
  }
  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany(testimonialSeed);
  }

  const email = (process.env.ADMIN_EMAIL || 'admin@mithaas.cafe').toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.warn('ADMIN_PASSWORD is not set. Admin sign-in stays disabled until it is added to .env.');
    return;
  }

  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({
      name: 'Mithaas Admin',
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: 'admin',
    });
    console.log(`Admin account ready for ${email}`);
    return;
  }

  const matches = await bcrypt.compare(password, existing.passwordHash);
  if (!matches) {
    existing.passwordHash = await bcrypt.hash(password, 12);
    await existing.save();
    console.log(`Admin password updated for ${email}`);
  }
}
