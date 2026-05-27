import { reactive } from 'vue';

const FALLBACK_LOCALE = 'en';

export const authStore = reactive({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,

  currentLanguage: localStorage.getItem('user_lang') || FALLBACK_LOCALE,

  subscription: {
    data: {},
    error: null,
    loading: false,
  },
  languages: [
    {
      id: 0,
      label: 'Italiano',
      value: 'it',
    },
    {
      id: 1,
      label: 'English',
      value: 'en',
    },
  ],
});
