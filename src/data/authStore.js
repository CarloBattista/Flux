import { reactive } from 'vue';

export const authStore = reactive({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
});
