import mongoose from 'mongoose';
import { MENU_CATEGORIES } from '../../shared/site.js';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: MENU_CATEGORIES },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 1 },
    image: { type: String, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model('MenuItem', menuItemSchema);
