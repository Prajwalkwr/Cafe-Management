import mongoose from 'mongoose';
import { RESERVATION_STATUSES } from '../../shared/site.js';

const reservationSchema = new mongoose.Schema(
  {
    reservationId: { type: String, required: true, unique: true },
    idempotencyKey: { type: String, unique: true, sparse: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true, min: 1, max: 12 },
    specialRequests: { type: String, default: '' },
    status: { type: String, enum: RESERVATION_STATUSES, default: 'pending' },
  },
  { timestamps: true },
);

reservationSchema.index({ date: 1, status: 1 });

export default mongoose.model('Reservation', reservationSchema);
