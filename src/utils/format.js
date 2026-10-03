export function formatNpr(value) {
  return `NPR ${Math.round(Number(value) || 0)}`;
}

export function formatTime(value) {
  if (!value || !value.includes(':')) return value || '';
  const [hRaw, mRaw] = value.split(':');
  const hour = Number(hRaw);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const display = hour % 12 || 12;
  return `${display}:${mRaw} ${suffix}`;
}

export function formatDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00+05:45`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Kathmandu',
  }).format(date);
}

export function statusLabel(status) {
  if (!status) return '';
  return status.charAt(0).toUpperCase() + status.slice(1);
}
