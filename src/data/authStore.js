import { reactive } from 'vue';

export const authStore = reactive({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,

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
