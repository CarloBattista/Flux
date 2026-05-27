import { createI18n } from 'vue-i18n';
import { authStore } from '../data/authStore';

import en from '../lang/en.json';
import it from '../lang/it.json';

// Definiamo i messaggi per le lingue supportate
const messages = {
  en,
  it,
};

localStorage.setItem('user_lang', authStore.currentLanguage);

// Recuperiamo la lingua salvata o usiamo quella del browser
const savedLang = localStorage.getItem('user_lang') || authStore.FALLBACK_LOCALE;

const i18n = createI18n({
  legacy: false, // Usiamo Composition API
  locale: savedLang,
  fallbackLocale: authStore.FALLBACK_LOCALE,
  messages,
});

export default i18n;

/**
 * Funzione per cambiare la lingua dell'applicazione
 * @param {string} lang - Il codice della lingua ('it', 'en', ecc.)
 */
export function setLanguage(lang) {
  i18n.global.locale.value = lang;
  localStorage.setItem('user_lang', lang);
  document.documentElement.lang = lang;
}
