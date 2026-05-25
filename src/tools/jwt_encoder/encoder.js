/**
 * Codifica un JWT (JSON Web Token) in locale utilizzando l'algoritmo selezionato.
 * Supporta HMAC, RSA e ECDSA tramite Web Crypto API.
 */
export async function encodeJWT(header, payload, key) {
  try {
    const algorithm = header.alg || 'HS256';

    const base64UrlEncode = (obj) => {
      const str = typeof obj === 'string' ? obj : JSON.stringify(obj);
      return btoa(unescape(encodeURIComponent(str)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedPayload = base64UrlEncode(payload);
    const partialToken = `${encodedHeader}.${encodedPayload}`;

    if (algorithm === 'none') {
      return { success: true, data: `${partialToken}.` };
    }

    if (!key) {
      return {
        success: true,
        data: `${partialToken}.`,
        warning: `Nessuna chiave fornita per ${algorithm}. Firma non generata.`,
      };
    }

    const encoder = new TextEncoder();
    const dataToSign = encoder.encode(partialToken);
    let signature;

    // --- HMAC (HS256, HS384, HS512) ---
    if (algorithm.startsWith('HS')) {
      const hashName = `SHA-${algorithm.slice(2)}`;
      const cryptoKey = await crypto.subtle.importKey('raw', encoder.encode(key), { name: 'HMAC', hash: hashName }, false, ['sign']);
      signature = await crypto.subtle.sign('HMAC', cryptoKey, dataToSign);
    }
    // --- RSA (RS256, RS384, RS512) ---
    else if (algorithm.startsWith('RS')) {
      const hashName = `SHA-${algorithm.slice(2)}`;
      const cryptoKey = await importPrivateKey(key, { name: 'RSASSA-PKCS1-v1_5', hash: hashName });
      signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', cryptoKey, dataToSign);
    }
    // --- RSA-PSS (PS256, PS384, PS512) ---
    else if (algorithm.startsWith('PS')) {
      const hashName = `SHA-${algorithm.slice(2)}`;
      const cryptoKey = await importPrivateKey(key, { name: 'RSA-PSS', hash: hashName });
      signature = await crypto.subtle.sign({ name: 'RSA-PSS', saltLength: parseInt(algorithm.slice(2)) / 8 }, cryptoKey, dataToSign);
    }
    // --- ECDSA (ES256, ES384, ES512) ---
    else if (algorithm.startsWith('ES')) {
      const curves = { 256: 'P-256', 384: 'P-384', 512: 'P-521' };
      const hashName = `SHA-${algorithm.slice(2)}`;
      const cryptoKey = await importPrivateKey(key, { name: 'ECDSA', namedCurve: curves[algorithm.slice(2)] }, hashName);
      signature = await crypto.subtle.sign({ name: 'ECDSA', hash: hashName }, cryptoKey, dataToSign);
    } else {
      throw new Error(`Algoritmo ${algorithm} non supportato o richiede librerie esterne (es. EdDSA).`);
    }

    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return { success: true, data: `${partialToken}.${encodedSignature}` };
  } catch (error) {
    return { success: false, error: 'Errore: ' + error.message };
  }
}

/**
 * Helper per importare chiavi private in formato PKCS#8 PEM
 */
async function importPrivateKey(pem, algorithm, hash) {
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  const pemContents = pem.substring(pemHeader.length, pem.length - pemFooter.length).replace(/\s/g, '');
  const binaryDerString = atob(pemContents);
  const binaryDer = new Uint8Array(binaryDerString.length);
  for (let i = 0; i < binaryDerString.length; i++) {
    binaryDer[i] = binaryDerString.charCodeAt(i);
  }

  return await crypto.subtle.importKey('pkcs8', binaryDer.buffer, hash ? { ...algorithm, hash } : algorithm, false, ['sign']);
}
