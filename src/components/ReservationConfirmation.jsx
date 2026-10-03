import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { formatDate, formatTime } from '../utils/format.js';

export default function ReservationConfirmation({ reservation, onReset }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="rounded-[1.6rem] bg-paper px-6 py-10 text-center shadow-sm sm:px-10"
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <motion.p
        className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-forest text-2xl text-cream"
        aria-hidden="true"
        initial={reduce ? false : { scale: 0.5 }}
        animate={reduce ? { scale: 1 } : { scale: [0.5, 1.1, 1] }}
        transition={reduce ? { duration: 0.2 } : { duration: 0.55, times: [0, 0.62, 1], ease: [0.22, 1, 0.36, 1] }}
      >
        ✓
      </motion.p>
      <motion.h3 className="display mt-5 text-4xl" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        Reservation Received!
      </motion.h3>
      <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
      <p className="mt-3 text-stone">Thank you for choosing Mithaas Café.</p>
      <p className="text-stone">Your table request has been received.</p>
      <dl className="mx-auto mt-8 max-w-sm space-y-3 text-left">
        <div className="flex justify-between gap-4 border-b border-line pb-2">
          <dt className="text-stone">Name</dt>
          <dd>{reservation.name}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-line pb-2">
          <dt className="text-stone">Date</dt>
          <dd>{formatDate(reservation.date)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-line pb-2">
          <dt className="text-stone">Time</dt>
          <dd>{formatTime(reservation.time)}</dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-line pb-2">
          <dt className="text-stone">Guests</dt>
          <dd>{reservation.guests}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-stone">Reservation ID</dt>
          <dd className="font-medium">{reservation.reservationId}</dd>
        </div>
      </dl>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to={`/reservation/${reservation.reservationId}`} className="btn btn-primary">View Reservation</Link>
        <button type="button" className="btn btn-line" onClick={onReset}>Book Another Table</button>
      </div>
      </motion.div>
    </motion.div>
  );
}
