import { z } from 'zod';
import { MENU_CATEGORIES, RESERVATION_STATUSES, isTimeWithinHours, kathmanduToday } from './site.js';

const phonePattern = /^(\+977)?(9[6-8]\d{8}|0?1\d{7})$/;

export function cleanString(value, max = 500) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

export function zodFieldErrors(error) {
  const errors = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] || 'form');
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export const reservationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Please enter your full name.')
      .max(80, 'Name is too long.')
      .regex(/^[\p{L}\s.'-]+$/u, 'Please use letters in your name.'),
    email: z.string().trim().email('Enter a valid email address.').max(120),
    phone: z
      .string()
      .trim()
      .transform((value) => value.replace(/[\s()-]/g, ''))
      .pipe(z.string().regex(phonePattern, 'Enter a valid Nepal phone number, such as 98XXXXXXXX.')),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date.'),
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Choose a time.'),
    guests: z.coerce
      .number()
      .int()
      .min(1, 'At least one guest is required.')
      .max(12, 'For more than 12 guests, please call the café.'),
    specialRequests: z
      .string()
      .max(500, 'Please keep special requests under 500 characters.')
      .optional()
      .default(''),
  })
  .superRefine((data, ctx) => {
    if (data.date < kathmanduToday()) {
      ctx.addIssue({ code: 'custom', path: ['date'], message: 'Please choose today or a future date.' });
    }
    if (!isTimeWithinHours(data.date, data.time)) {
      ctx.addIssue({
        code: 'custom',
        path: ['time'],
        message: 'Please choose a time during opening hours.',
      });
    }
  });

export const menuSchema = z.object({
  name: z.string().trim().min(2, 'Enter an item name.').max(80),
  category: z.enum(MENU_CATEGORIES, { errorMap: () => ({ message: 'Choose a valid category.' }) }),
  description: z.string().trim().min(10, 'Add a short description.').max(400),
  price: z.coerce.number().int('Price must be a whole number.').min(1, 'Enter a price in NPR.').max(100000),
  image: z.string().trim().min(1, 'Choose or upload a photo.').max(240),
  available: z.boolean(),
});

export const gallerySchema = z.object({
  title: z.string().trim().min(2, 'Enter a title.').max(80),
  alt: z.string().trim().min(4, 'Describe the photo for screen readers.').max(180),
  image: z.string().trim().min(1).max(240),
  visible: z.boolean(),
  order: z.coerce.number().int().min(0).max(999).optional().default(0),
});

export const statusSchema = z.object({
  status: z.enum(RESERVATION_STATUSES),
});

export function parseAvailable(value, fallback = true) {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === 'on' || value === '1') return true;
  if (value === 'false' || value === 'off' || value === '0') return false;
  return fallback;
}
