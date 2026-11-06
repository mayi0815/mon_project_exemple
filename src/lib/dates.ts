export function dateLabel(value: string, options: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', ...options }).format(new Date(value));
}
export const eventDay = (value: string) => dateLabel(value, { day: 'numeric' });
export const eventMonth = (value: string) => dateLabel(value, { month: 'short' }).replace('.', '');
export const eventTime = (value: string) => dateLabel(value, { hour: '2-digit', minute: '2-digit' });
export const eventDate = (value: string) => dateLabel(value, { weekday: 'long', day: 'numeric', month: 'long' });
