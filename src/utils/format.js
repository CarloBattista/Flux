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
