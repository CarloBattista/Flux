export function decodeJWT(token) {
  if (!token) return { success: true, data: null };

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Formato JWT non valido (richiede 3 parti separate da punti)');
    }

    const decode = (str) => {
      try {
        return JSON.parse(atob(str.replace(/-/g, '+').replace(/_/g, '/')));
      } catch (e) {
        throw new Error('Base64 non valido');
      }
    };

    const header = decode(parts[0]);
    const payload = decode(parts[1]);

    return {
      success: true,
      data: {
        header,
        payload,
        signature: parts[2],
      },
    };
  } catch (error) {
    return {
      success: false,
      error: 'Impossibile decodificare il token: ' + error.message,
    };
  }
}

export function getExpirationInfo(payload) {
  if (!payload || !payload.exp) return null;

  const exp = payload.exp * 1000;
  const now = Date.now();
  const timeLeft = exp - now;
  const isExpired = timeLeft <= 0;

  return {
    expirationDate: new Date(exp).toLocaleString(),
    isExpired,
    timeLeft: isExpired ? 0 : Math.floor(timeLeft / 1000),
  };
}
