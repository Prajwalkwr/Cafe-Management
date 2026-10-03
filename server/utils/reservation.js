import crypto from 'crypto';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function createReservationId(date = new Date()) {
  const year = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
  }).format(date);
  const bytes = crypto.randomBytes(4);
  let code = '';
  for (let i = 0; i < 4; i += 1) code += alphabet[bytes[i] % alphabet.length];
  return `MIT-${year}-${code}`;
}

export function publicReservation(doc) {
  return {
    reservationId: doc.reservationId,
    name: doc.name,
    date: doc.date,
    time: doc.time,
    guests: doc.guests,
    status: doc.status,
    specialRequests: doc.specialRequests || '',
    createdAt: doc.createdAt,
  };
}

export function adminReservation(doc) {
  return {
    id: doc._id,
    reservationId: doc.reservationId,
    name: doc.name,
    email: doc.email,
    phone: doc.phone,
    date: doc.date,
    time: doc.time,
    guests: doc.guests,
    specialRequests: doc.specialRequests || '',
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
