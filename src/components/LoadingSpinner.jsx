export default function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div role="status" className="flex items-center gap-3 text-stone">
      <span className="spinner h-5 w-5 rounded-full border-2 border-line border-t-coffee" />
      <span>{label}</span>
    </div>
  );
}
