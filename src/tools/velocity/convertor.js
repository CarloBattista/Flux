export function convertVelocity(value, from, to) {
  if (from === to) return value;

  const factors = {
    meter_per_second: 1,
    kilometer_per_hour: 1 / 3.6,
    mile_per_hour: 0.44704,
    foot_per_second: 0.3048,
    knot: 0.514444,
  };

  if (factors[from] === undefined || factors[to] === undefined) return null;

  // Converti in metri al secondo (unità base)
  const mps = value * factors[from];

  // Converti da metri al secondo all'unità di destinazione
  return mps / factors[to];
}
