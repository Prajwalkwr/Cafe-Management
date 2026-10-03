import { useState } from 'react';
import { formatDate, formatTime, statusLabel } from '../utils/format.js';
import { deleteReservation, updateReservation } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export default function ReservationTable({ reservations, onReload }) {
  const toast = useToast();
  const [busy, setBusy] = useState('');
  const [viewing, setViewing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState('');

  async function changeStatus(id, status) {
    setBusy(id + status);
    try {
      await updateReservation(id, status);
      toast({ message: `Reservation marked ${status}.` });
      await onReload();
    } catch (error) {
      toast({ tone: 'error', message: error.message });
    } finally {
      setBusy('');
    }
  }

  async function remove(id) {
    setBusy(id + 'delete');
    try {
      await deleteReservation(id);
      toast({ message: 'Reservation deleted.' });
      setConfirmDelete('');
      setViewing(null);
      await onReload();
    } catch (error) {
      toast({ tone: 'error', message: error.message });
    } finally {
      setBusy('');
    }
  }

  if (!reservations.length) {
    return <p className="rounded-3xl bg-paper px-5 py-8 text-stone">No reservations yet. New table requests will show up here.</p>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-3xl border border-line bg-paper md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line text-xs tracking-[0.14em] text-stone uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Guests</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((item) => (
              <tr key={item.id} className="border-b border-line/70 last:border-0">
                <td className="px-4 py-3">{item.reservationId}</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{formatDate(item.date)}</td>
                <td className="px-4 py-3">{formatTime(item.time)}</td>
                <td className="px-4 py-3">{item.guests}</td>
                <td className="px-4 py-3">{statusLabel(item.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className="btn btn-line btn-small" onClick={() => setViewing(item)}>View</button>
                    <button type="button" className="btn btn-line btn-small" disabled={busy || item.status !== 'pending'} onClick={() => changeStatus(item.id, 'confirmed')}>Confirm</button>
                    <button type="button" className="btn btn-line btn-small" disabled={busy || !['pending', 'confirmed'].includes(item.status)} onClick={() => changeStatus(item.id, 'cancelled')}>Cancel</button>
                    <button type="button" className="btn btn-line btn-small" disabled={busy || !['pending', 'confirmed'].includes(item.status)} onClick={() => changeStatus(item.id, 'completed')}>Complete</button>
                    <button type="button" className="btn btn-line btn-small" disabled={Boolean(busy)} onClick={() => setConfirmDelete(item.id)}>Delete</button>
                  </div>
                  {confirmDelete === item.id && (
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span>Delete this reservation?</span>
                      <button type="button" className="underline" onClick={() => remove(item.id)}>Yes</button>
                      <button type="button" className="underline" onClick={() => setConfirmDelete('')}>No</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {reservations.map((item) => (
          <article key={item.id} className="rounded-3xl border border-line bg-paper p-4">
            <p className="text-xs tracking-[0.14em] text-stone uppercase">{item.reservationId}</p>
            <h3 className="mt-1 text-lg">{item.name}</h3>
            <p className="text-sm text-stone">{formatDate(item.date)} · {formatTime(item.time)} · {item.guests} guests</p>
            <p className="mt-1 text-sm">{statusLabel(item.status)}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className="btn btn-line btn-small" onClick={() => setViewing(item)}>View</button>
              <button type="button" className="btn btn-line btn-small" disabled={busy || item.status !== 'pending'} onClick={() => changeStatus(item.id, 'confirmed')}>Confirm</button>
              <button type="button" className="btn btn-line btn-small" disabled={busy || !['pending', 'confirmed'].includes(item.status)} onClick={() => changeStatus(item.id, 'cancelled')}>Cancel</button>
              <button type="button" className="btn btn-line btn-small" disabled={busy || !['pending', 'confirmed'].includes(item.status)} onClick={() => changeStatus(item.id, 'completed')}>Complete</button>
              <button type="button" className="btn btn-line btn-small" onClick={() => remove(item.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
      {viewing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="reservation-view-title" className="w-full max-w-md rounded-3xl bg-paper p-6">
            <h3 id="reservation-view-title" className="display text-3xl">{viewing.reservationId}</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-stone">Name</dt><dd>{viewing.name}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone">Email</dt><dd>{viewing.email}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone">Phone</dt><dd>{viewing.phone}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone">When</dt><dd>{formatDate(viewing.date)} · {formatTime(viewing.time)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone">Guests</dt><dd>{viewing.guests}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-stone">Status</dt><dd>{statusLabel(viewing.status)}</dd></div>
              {viewing.specialRequests && <div><dt className="text-stone">Notes</dt><dd className="mt-1">{viewing.specialRequests}</dd></div>}
            </dl>
            <button type="button" className="btn btn-primary mt-6" onClick={() => setViewing(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
