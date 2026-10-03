import Reservation from '../models/Reservation.js';
import { reservationSchema, statusSchema, cleanString, zodFieldErrors } from '../../shared/validation.js';
import { adminReservation, createReservationId, publicReservation } from '../utils/reservation.js';

function cleanedBody(body) {
  return {
    name: cleanString(body?.name, 80),
    email: cleanString(body?.email, 120).toLowerCase(),
    phone: cleanString(body?.phone, 20),
    date: cleanString(body?.date, 10),
    time: cleanString(body?.time, 5),
    guests: body?.guests,
    specialRequests: cleanString(body?.specialRequests, 500),
  };
}

async function findReservation(id) {
  if (/^[a-f\d]{24}$/i.test(id)) {
    const byId = await Reservation.findById(id);
    if (byId) return byId;
  }
  return Reservation.findOne({ reservationId: String(id).toUpperCase() });
}

export async function createReservation(req, res, next) {
  try {
    const idempotencyKey = cleanString(req.get('Idempotency-Key'), 80);
    if (idempotencyKey) {
      const existing = await Reservation.findOne({ idempotencyKey });
      if (existing) {
        return res.status(200).json({ reservation: publicReservation(existing) });
      }
    }

    const parsed = reservationSchema.safeParse(cleanedBody(req.body));
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Please check the form and try again.',
        errors: zodFieldErrors(parsed.error),
      });
    }

    let reservation = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        reservation = await Reservation.create({
          ...parsed.data,
          reservationId: createReservationId(),
          idempotencyKey: idempotencyKey || undefined,
          status: 'pending',
        });
        break;
      } catch (error) {
        if (error?.code === 11000 && error.keyPattern?.idempotencyKey) {
          const existing = await Reservation.findOne({ idempotencyKey });
          if (existing) return res.status(200).json({ reservation: publicReservation(existing) });
        }
        if (error?.code === 11000 && error.keyPattern?.reservationId) continue;
        throw error;
      }
    }

    if (!reservation) {
      return res.status(500).json({ message: 'We could not save the reservation. Please try again.' });
    }

    return res.status(201).json({ reservation: publicReservation(reservation) });
  } catch (error) {
    return next(error);
  }
}

export async function listReservations(req, res, next) {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 }).limit(300);
    return res.json({ reservations: reservations.map(adminReservation) });
  } catch (error) {
    return next(error);
  }
}

export async function getReservation(req, res, next) {
  try {
    const reservation = await findReservation(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'We could not find a reservation with that ID.' });
    }
    return res.json({ reservation: publicReservation(reservation) });
  } catch (error) {
    return next(error);
  }
}

export async function updateReservation(req, res, next) {
  try {
    const parsed = statusSchema.safeParse({ status: cleanString(req.body?.status, 20) });
    if (!parsed.success) {
      return res.status(400).json({
        message: 'Choose a valid reservation status.',
        errors: zodFieldErrors(parsed.error),
      });
    }

    const reservation = await findReservation(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'We could not find that reservation.' });
    }

    const allowed = {
      pending: ['confirmed', 'cancelled', 'completed'],
      confirmed: ['cancelled', 'completed'],
      cancelled: [],
      completed: [],
    };
    if (
      reservation.status !== parsed.data.status &&
      !allowed[reservation.status].includes(parsed.data.status)
    ) {
      return res.status(400).json({ message: 'That status change is not available for this reservation.' });
    }

    reservation.status = parsed.data.status;
    await reservation.save();
    return res.json({ reservation: adminReservation(reservation) });
  } catch (error) {
    return next(error);
  }
}

export async function deleteReservation(req, res, next) {
  try {
    const reservation = await findReservation(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'We could not find that reservation.' });
    }
    await reservation.deleteOne();
    return res.json({ message: 'Reservation deleted.' });
  } catch (error) {
    return next(error);
  }
}
