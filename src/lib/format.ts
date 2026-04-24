/**
 * Auto-formata horário enquanto o usuário digita.
 * "1" → "1"
 * "12" → "12"
 * "123" → "12:3"
 * "1230" → "12:30"
 * "12:30" → "12:30"
 * Aceita no máximo 4 dígitos (HHMM).
 */
export function formatTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + ':' + digits.slice(2);
}

/** Valida HH:MM ou HHMM completo (aceita 00:00 a 23:59). */
export function isValidTime(s: string): boolean {
  const formatted = formatTimeInput(s);
  if (!/^\d{2}:\d{2}$/.test(formatted)) return false;
  const [hh, mm] = formatted.split(':').map(Number);
  return hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59;
}

/** Normaliza qualquer entrada pra HH:MM (ou retorna como veio se incompleta). */
export function normalizeTime(s: string): string {
  const digits = s.replace(/\D/g, '').slice(0, 4);
  if (digits.length === 4) return digits.slice(0, 2) + ':' + digits.slice(2);
  if (digits.length === 3) return '0' + digits.slice(0, 1) + ':' + digits.slice(1);
  return formatTimeInput(s);
}
