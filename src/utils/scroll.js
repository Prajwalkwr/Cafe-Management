export function scrollToId(id) {
  const element = document.getElementById(id);
  if (!element) return false;
  element.scrollIntoView({ behavior: 'auto', block: 'start' });
  return true;
}
