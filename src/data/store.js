import { reactive } from 'vue';

export const store = reactive({
  isMac: typeof window !== 'undefined' ? /Mac|iPod|iPhone|iPad/.test(navigator.platform) : false,
  searchBar: {
    isOpen: false,
  },

  featureFlags: {},
  plans: {
    data: [],
    error: null,
    loading: false,
  },
  favorites: {
    data: [],
    error: null,
    loading: false,
  },
  recentTools: {
    data: [],
    error: null,
    loading: false,
  },

  tools: {
    data: [],
    error: null,
    loading: false,
  },
});
