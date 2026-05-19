export function convertTime(value, from, to) {
  if (from === to) return value;

  const factors = {
    nanosecond: 1e-9,
    microsecond: 1e-6,
    millisecond: 0.001,
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    week: 604800,
    month: 2629746, // Media di 30.436875 giorni
    year: 31557600, // Anno giuliano (365.25 giorni)
    calendar_year: 31536000, // Anno civile (365 giorni)
    decade: 315576000,
    century: 3155760000,
  };

  if (!factors[from] || !factors[to]) return null;

  // Converti in secondi (unità base)
  const seconds = value * factors[from];

  // Converti da secondi all'unità di destinazione
  return seconds / factors[to];
}
