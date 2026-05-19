export function convertDataTransferRate(value, from, to) {
  if (from === to) return value;

  const factors = {
    bps: 1,
    kbps: 1000,
    kBps: 8000,
    Kibps: 1024,
    Mbps: 1000000,
    MBps: 8000000,
    Mibps: 1048576,
    Gbps: 1000000000,
    GBps: 8000000000,
    Gibps: 1073741824,
    Tbps: 1000000000000,
    TBps: 8000000000000,
    Tibps: 1099511627776,
  };

  if (factors[from] === undefined || factors[to] === undefined) return null;

  // Converti in bps (unità base)
  const bps = value * factors[from];

  // Converti da bps all'unità di destinazione
  return bps / factors[to];
}
