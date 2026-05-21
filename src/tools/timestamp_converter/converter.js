export function toDate(timestamp) {
  try {
    if (!timestamp) return { success: false, error: 'Timestamp vuoto' };

    let ts = Number(timestamp);
    if (isNaN(ts)) return { success: false, error: 'Timestamp non valido' };

    if (ts < 10000000000) {
      ts = ts * 1000;
    }

    const date = new Date(ts);
    if (date.toString() === 'Invalid Date') {
      return { success: false, error: 'Data non valida' };
    }

    return {
      success: true,
      data: {
        iso: date.toISOString(),
        local: date.toLocaleString(),
        utc: date.toUTCString(),
        timestamp: ts,
      },
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

export function fromDate(dateString) {
  try {
    if (!dateString) return { success: false, error: 'Data vuota' };

    const date = new Date(dateString);
    if (date.toString() === 'Invalid Date') {
      return { success: false, error: 'Formato data non valido' };
    }

    const ms = date.getTime();
    return {
      success: true,
      data: {
        seconds: Math.floor(ms / 1000),
        milliseconds: ms,
        iso: date.toISOString(),
      },
    };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
