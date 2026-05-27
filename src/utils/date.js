export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function parseISODate(value) {
  return new Date(`${value}T12:00:00`);
}

export function daysUntil(dateISO) {
  const start = parseISODate(todayISO());
  const end = parseISODate(dateISO);
  return Math.round((end - start) / 86400000);
}

export function formatShortDate(dateISO) {
  if (!dateISO) return '--/--';
  return parseISODate(dateISO).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export function formatLongDate(dateISO) {
  if (!dateISO) return '';
  return parseISODate(dateISO).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}
