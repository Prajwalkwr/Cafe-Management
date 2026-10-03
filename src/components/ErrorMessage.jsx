export default function ErrorMessage({ title = 'We could not load this just now.', message, onRetry }) {
  return (
    <div role="alert" className="rounded-3xl border border-terracotta/30 bg-paper px-5 py-5">
      <p className="font-medium">{title}</p>
      {message && <p className="mt-1 text-sm text-stone">{message}</p>}
      {onRetry && (
        <button type="button" className="btn btn-line btn-small mt-4" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
