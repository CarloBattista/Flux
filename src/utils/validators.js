/**
 * Valida un indirizzo email utilizzando una espressione regolare.
 * @param {string} email - L'indirizzo email da validare.
 * @returns {boolean} - True se l'email è valida, false altrimenti.
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida la forza di una password (minimo 8 caratteri).
 * @param {string} password - La password da validare.
 * @returns {boolean} - True se la password è valida, false altrimenti.
 */
export const isValidPassword = (password) => {
  return password.length >= 8;
};
