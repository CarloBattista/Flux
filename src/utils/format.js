import { authStore } from '../data/authStore';

/**
 * Converte un codice lingua (es. 'it') nel corrispondente label (es. 'Italiano').
 * @param {string} langCode - Il codice della lingua.
 * @returns {string} - Il label della lingua o 'Italiano' come fallback.
 */
export const formatLanguage = (langCode) => {
  if (!langCode) return 'Italiano';

  const language = authStore.languages.find((l) => l.value === langCode);

  return language ? language.label : 'Italiano';
};

/**
 * Formatta una data in formato italiano.
 * @param {string|Date} dateString - La data da formattare.
 * @param {boolean} includeTime - Se includere l'ora nella formattazione.
 * @param {string} style - Lo stile della data: 'numeric' (27/05/2026) o 'expanded' (27 Mag, 2026).
 * @param {boolean} useUTC - Se visualizzare la data in formato UTC (evita la conversione del fuso orario locale).
 * @returns {string} - La data formattata.
 */
export const formatDate = (dateString, includeTime = false, style = 'numeric', useUTC = false) => {
  if (!dateString) return '';
  const date = new Date(dateString);

  const options = {};

  if (useUTC) {
    options.timeZone = 'UTC';
  }

  if (style === 'expanded') {
    options.day = '2-digit';
    options.month = 'short';
    options.year = 'numeric';
  } else {
    options.day = '2-digit';
    options.month = '2-digit';
    options.year = 'numeric';
  }

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  let formatted = date.toLocaleString('it-IT', options);

  if (includeTime) {
    formatted = formatted.replace(', ', ' alle ');
  }

  if (style === 'expanded') {
    // Trasforma "27 mag 2026" in "27 Mag, 2026"
    // Cerchiamo la parola (mese) tra il giorno e l'anno
    const regex = style === 'expanded' ? /(\d{2})\s([a-z]+)\.?\s(\d{4})/ : null;
    if (regex) {
      formatted = formatted.replace(regex, (match, day, month, year) => {
        const capMonth = month.charAt(0).toUpperCase() + month.slice(1);
        return `${day} ${capMonth}, ${year}`;
      });
    }
  }

  return formatted;
};
