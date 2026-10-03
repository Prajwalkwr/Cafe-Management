import { useCallback, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ErrorMessage from '../components/ErrorMessage.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { fetchReservation } from '../services/api.js';
import { formatDate, formatTime, statusLabel } from '../utils/format.js';
export default function ReservationDetails() {
  const { id } = useParams();
  const loader = useCallback(() => fetchReservation(id), [id]);
  const result = useAsync(loader);
  const reservation = result.data;

  useEffect(() => {
    document.title = 'Reservation · Mithaas Café';
    return () => {
      document.title = 'Mithaas Café | Kathmandu';
    };
  }, []);

  return (
    <section className="section pt-32">
      <div className="shell max-w-xl">
        {result.loading && <LoadingSpinner label="Looking up your reservation" />}
        {!result.loading && result.error && <ErrorMessage title="Reservation not available" message={result.error} onRetry={result.reload} />}
        {!result.loading && !result.error && reservation && (
          <article className="rounded-[1.6rem] bg-paper p-6 sm:p-8">
            <p className="eyebrow">Your table</p>
            <h1 className="display mt-3 text-4xl">{reservation.reservationId}</h1>
            <p className="mt-2 text-stone">Status: {statusLabel(reservation.status)}</p>
            <dl className="mt-6 space-y-3">
              <div className="flex justify-between gap-4 border-b border-line pb-2"><dt className="text-stone">Name</dt><dd>{reservation.name}</dd></div>
              <div className="flex justify-between gap-4 border-b border-line pb-2"><dt className="text-stone">Date</dt><dd>{formatDate(reservation.date)}</dd></div>
              <div className="flex justify-between gap-4 border-b border-line pb-2"><dt className="text-stone">Time</dt><dd>{formatTime(reservation.time)}</dd></div>
              <div className="flex justify-between gap-4 border-b border-line pb-2"><dt className="text-stone">Guests</dt><dd>{reservation.guests}</dd></div>
              {reservation.specialRequests && (
                <div>
                  <dt className="text-stone">Notes</dt>
                  <dd className="mt-1">{reservation.specialRequests}</dd>
                </div>
              )}
            </dl>
            <Link to="/#reserve" className="btn btn-primary mt-8">Book Another Table</Link>
          </article>
        )}
      </div>
    </section>
  );
}
