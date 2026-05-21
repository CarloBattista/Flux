export function encodeBase64(text) {
  if (!text) return { success: true, data: '' };
  try {
    const bytes = new TextEncoder().encode(text);
    const binString = String.fromCodePoint(...bytes);
    return {
      success: true,
      data: btoa(binString),
    };
  } catch (error) {
    return {
      success: false,
      error: 'Errore durante la codifica: ' + error.message,
    };
  }
}

export function decodeBase64(base64) {
  if (!base64) return { success: true, data: '' };
  try {
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0));
    return {
      success: true,
      data: new TextDecoder().decode(bytes),
    };
  } catch (error) {
    return {
      success: false,
      error: 'Base64 non valido: ' + error.message,
    };
  }
}
