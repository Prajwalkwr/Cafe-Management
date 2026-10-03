import { useMemo, useRef, useState } from 'react';
import Eyebrow from './Eyebrow.jsx';
import FadeUp from './FadeUp.jsx';
import ReservationConfirmation from './ReservationConfirmation.jsx';
import { hoursForDate, kathmanduToday, timeSlotsForDate, WEEKDAY_HOURS, WEEKEND_HOURS } from '../../shared/site.js';
import { reservationSchema, zodFieldErrors } from '../../shared/validation.js';
import { createReservation } from '../services/api.js';
import { formatTime } from '../utils/format.js';

const empty = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  specialRequests: '',
};

export default function ReservationForm() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [pending, setPending] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const lock = useRef(false);
  const idempotencyKey = useRef(crypto.randomUUID());
  const slots = useMemo(() => timeSlotsForDate(form.date), [form.date]);
  const hours = form.date ? hoursForDate(form.date) : null;

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value, ...(field === 'date' ? { time: '' } : {}) }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (lock.current) return;
    const parsed = reservationSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(zodFieldErrors(parsed.error));
      setFormError('Please check the highlighted fields.');
      return;
    }
    lock.current = true;
    setPending(true);
    setFormError('');
    try {
      const reservation = await createReservation(parsed.data, idempotencyKey.current);
      setConfirmation(reservation);
    } catch (error) {
      setErrors(error.errors || {});
      setFormError(error.message || 'The reservation could not be saved.');
    } finally {
      lock.current = false;
      setPending(false);
    }
  }

  function reset() {
    idempotencyKey.current = crypto.randomUUID();
    setForm(empty);
    setErrors({});
    setFormError('');
    setConfirmation(null);
  }

  return (
    <section id="reserve" className="section scroll-mt-24 bg-forest text-cream">
      <div className="shell grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <FadeUp>
        <div>
          <Eyebrow light>Reserve</Eyebrow>
          <h2 className="display mt-3 text-4xl sm:text-5xl">Reserve Your Table</h2>
          <p className="mt-4 max-w-md text-cream/80">
            Walk in for coffee or reserve a table for a relaxed meal with friends and family.
          </p>
          <div className="mt-8 space-y-3 text-sm text-cream/80">
            <p>{WEEKDAY_HOURS.label}<br />{WEEKDAY_HOURS.display}</p>
            <p>{WEEKEND_HOURS.label}<br />{WEEKEND_HOURS.display}</p>
            {hours && <p>On this date we seat guests from {hours.display}.</p>}
          </div>
        </div>
        </FadeUp>
        {confirmation ? (
          <ReservationConfirmation reservation={confirmation} onReset={reset} />
        ) : (
          <FadeUp delay={0.12}>
          <form onSubmit={onSubmit} className="rounded-[1.6rem] bg-cream p-5 text-ink sm:p-8" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="label">Full Name</span>
                <input className="field" name="name" autoComplete="name" value={form.name} onChange={(event) => update('name', event.target.value)} required />
                {errors.name && <span className="mt-1 block text-sm text-terracotta">{errors.name}</span>}
              </label>
              <label>
                <span className="label">Email Address</span>
                <input className="field" type="email" name="email" autoComplete="email" value={form.email} onChange={(event) => update('email', event.target.value)} required />
                {errors.email && <span className="mt-1 block text-sm text-terracotta">{errors.email}</span>}
              </label>
              <label>
                <span className="label">Phone Number</span>
                <input className="field" type="tel" name="phone" autoComplete="tel" placeholder="98XXXXXXXX" value={form.phone} onChange={(event) => update('phone', event.target.value)} required />
                {errors.phone && <span className="mt-1 block text-sm text-terracotta">{errors.phone}</span>}
              </label>
              <label>
                <span className="label">Date</span>
                <input className="field" type="date" name="date" min={kathmanduToday()} value={form.date} onChange={(event) => update('date', event.target.value)} required />
                {errors.date && <span className="mt-1 block text-sm text-terracotta">{errors.date}</span>}
              </label>
              <label>
                <span className="label">Time</span>
                <select className="field" name="time" value={form.time} disabled={!form.date} onChange={(event) => update('time', event.target.value)} required>
                  <option value="">{form.date ? 'Choose a time' : 'Choose a date first'}</option>
                  {slots.map((slot) => (
                    <option key={slot} value={slot}>{formatTime(slot)}</option>
                  ))}
                </select>
                {errors.time && <span className="mt-1 block text-sm text-terracotta">{errors.time}</span>}
              </label>
              <div className="sm:col-span-2">
                <span className="label">Number of Guests</span>
                <div className="flex items-center gap-4">
                  <button type="button" className="btn btn-line h-11 w-11 px-0" aria-label="Fewer guests" onClick={() => update('guests', Math.max(1, form.guests - 1))}>−</button>
                  <span className="min-w-6 text-center text-lg" aria-live="polite">{form.guests}</span>
                  <button type="button" className="btn btn-line h-11 w-11 px-0" aria-label="More guests" onClick={() => update('guests', Math.min(12, form.guests + 1))}>+</button>
                </div>
                {errors.guests && <span className="mt-1 block text-sm text-terracotta">{errors.guests}</span>}
              </div>
              <label className="sm:col-span-2">
                <span className="label">Special Requests</span>
                <textarea className="field min-h-28" name="specialRequests" value={form.specialRequests} onChange={(event) => update('specialRequests', event.target.value)} />
                {errors.specialRequests && <span className="mt-1 block text-sm text-terracotta">{errors.specialRequests}</span>}
              </label>
            </div>
            {formError && <p role="alert" className="mt-4 text-sm text-terracotta">{formError}</p>}
            <button type="submit" className="btn btn-primary mt-6 w-full" disabled={pending}>
              {pending ? 'Processing...' : 'Confirm Reservation'}
            </button>
          </form>
          </FadeUp>
        )}
      </div>
    </section>
  );
}
