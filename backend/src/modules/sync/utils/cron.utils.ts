// backend/src/modules/sync/utils/cron.utils.ts

// Converte um intervalo em horas para uma expressão cron válida.
//
// Exemplos:
//   1h  -> "0 * * * *"       (a cada hora, no minuto 0)
//   2h  -> "0 */2 * * *"
//   6h  -> "0 */6 * * *"
//   24h -> "0 0 * * *"       (meia-noite todo dia)

export function intervalHoursToCron(hours: number): string {
  if (hours >= 24) return '0 0 * * *';
  if (hours === 1) return '0 * * * *';
  return `0 */${hours} * * *`;
}

// Valida se um número de horas é um intervalo permitido.
export function isValidIntervalHours(hours: number): hours is 1 | 2 | 4 | 6 | 12 | 24 {
  return [1, 2, 4, 6, 12, 24].includes(hours);
}