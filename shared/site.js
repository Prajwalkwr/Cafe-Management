export const CAFE_LOCATION = {
  name: 'Mithaas Café',
  street: 'Jhamsikhel, Lalitpur',
  city: 'Kathmandu',
  country: 'Nepal',
  lat: 27.6782,
  lng: 85.3075,
};

export const CAFE_CONTACT = {
  phone: '+977 980-120-3344',
  phoneHref: '+9779801203344',
  email: 'hello@mithaas.cafe',
};

export const CAFE_SOCIAL = [
  { name: 'Instagram', handle: '@mithaas.cafe', url: '' },
  { name: 'Facebook', handle: 'Mithaas Café', url: '' },
  { name: 'TikTok', handle: '@mithaas.cafe', url: '' },
];

export const TABLE_COUNT = 18;

export const MENU_CATEGORIES = ['Coffee', 'Tea', 'Nepali', 'Snacks', 'Main Course', 'Desserts'];

export const RESERVATION_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

export const WEEKDAY_HOURS = { open: '07:30', close: '21:00', label: 'Monday – Friday', display: '7:30 AM – 9:00 PM' };
export const WEEKEND_HOURS = { open: '08:00', close: '22:00', label: 'Saturday – Sunday', display: '8:00 AM – 10:00 PM' };

export function kathmanduToday(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function hoursForDate(dateStr) {
  const weekday = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: 'Asia/Kathmandu',
  }).format(new Date(`${dateStr}T12:00:00+05:45`));
  return weekday === 'Sat' || weekday === 'Sun' ? WEEKEND_HOURS : WEEKDAY_HOURS;
}

export function isTimeWithinHours(dateStr, time) {
  if (!dateStr || !time) return false;
  const { open, close } = hoursForDate(dateStr);
  return time >= open && time <= close;
}

export function timeSlotsForDate(dateStr) {
  if (!dateStr) return [];
  const { open, close } = hoursForDate(dateStr);
  const [openH, openM] = open.split(':').map(Number);
  const [closeH, closeM] = close.split(':').map(Number);
  const slots = [];
  let minutes = openH * 60 + openM;
  const end = closeH * 60 + closeM;
  while (minutes <= end) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    minutes += 30;
  }
  return slots;
}

export function mapEmbedUrl() {
  const pad = 0.012;
  const { lat, lng } = CAFE_LOCATION;
  const bbox = [lng - pad, lat - pad, lng + pad, lat + pad].join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;
}

export function mapLink() {
  const { lat, lng } = CAFE_LOCATION;
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
}
