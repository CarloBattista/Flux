<template>
  <Transition name="slide-fade">
    <div v-if="store.searchBar.isOpen" class="fixed z-99999 top-0 left-0 w-full px-6 pt-20 md:pt-27 pointer-events-none">
      <div class="w-full max-w-[640px] mx-auto bg-[#1b1b1b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto">
        <!-- Input Area -->
        <div class="relative w-full h-16 flex items-center px-6 gap-4 border-b border-white/10">
          <SearchIcon class="text-white/40" size="24" />
          <input
            ref="searchInput"
            v-model="searchQuery"
            type="text"
            placeholder="Cerca uno strumento..."
            class="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder:text-white/20"
            @keydown.esc="store.searchBar.isOpen = false"
            @keydown.down.prevent="moveSelection(1)"
            @keydown.up.prevent="moveSelection(-1)"
            @keydown.enter="selectTool"
          />
          <div class="flex items-center gap-2">
            <hrButtonShortcut icon="ESC" class="hidden md:flex" />
            <button @click="store.searchBar.isOpen = false" class="p-1 hover:bg-white/5 rounded-lg transition-colors">
              <CloseIcon class="text-white/40" size="20" />
            </button>
          </div>
        </div>

        <!-- Results Area -->
        <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
          <div class="w-full px-4 pt-4">
            <h2 class="text-white text-sm font-semibold brightness-50">Risultati di ricerca</h2>
          </div>
          <div v-if="filteredTools.length > 0" class="p-2">
            <RouterLink
              v-for="(tool, index) in filteredTools"
              :key="tool.metadata.slug"
              :to="'/tool/' + tool.metadata.slug"
              class="w-full flex items-center gap-4 p-2 rounded-2xl transition-all duration-200"
              :class="[selectedIndex === index ? 'hover:bg-white/15' : 'hover:bg-white/5']"
              @click="store.searchBar.isOpen = false"
              @mouseenter="selectedIndex = index"
            >
              <div
                class="h-8 aspect-square rounded-xl flex items-center justify-center shrink-0"
                :class="[selectedIndex === index ? 'bg-white/20 text-white' : 'bg-white/5 text-white/70']"
              >
                <component :is="tool.metadata.icon" size="18" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-white text-base font-semibold truncate">{{ tool.metadata.title }}</span>
                  <span v-if="tool.metadata.new" class="bg-green-600/40 text-green-400 text-[10px] font-bold py-0.5 px-1.5 rounded-md">NEW</span>
                </div>
                <p class="text-white/40 text-xs truncate">{{ tool.metadata.description }}</p>
              </div>
              <ChevronRight v-if="selectedIndex === index" size="18" class="text-white/70" />
            </RouterLink>
          </div>
          <div v-else class="p-12 text-center">
            <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon class="text-white/20" size="32" />
            </div>
            <p class="text-white/60 font-medium">Nessun risultato trovato per "{{ searchQuery }}"</p>
            <p class="text-white/30 text-sm mt-1">Prova con parole chiave diverse</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-3 bg-black/20 border-t border-white/10 flex items-center justify-between text-[11px] text-white/30">
          <div class="flex items-center gap-4">
            <hrButtonShortcut icon="↑↓" label="Naviga" class="hidden md:flex" />
            <hrButtonShortcut icon="Enter" label="Seleziona" class="hidden md:flex" />
          </div>
          <div class="flex items-center gap-1.5">
            <span>Powered by Flux</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="fade">
    <div
      @click="store.searchBar.isOpen = false"
      v-if="store.searchBar.isOpen"
      class="fixed z-9999 top-0 left-0 w-full h-svh bg-black/60 backdrop-blur-sm"
    ></div>
  </Transition>
</template>

<script>
import { tools } from '../../toolsRegistry';
import { store } from '../../data/store';

import hrButtonShortcut from '../button/hr-button-shortcut.vue';

// ICONS
import {
  Search as SearchIcon,
  X as CloseIcon,
  ChevronRight,
  Image as ImageIcon,
  Video as VideoIcon,
  Thermometer,
  Clock,
  Gauge,
  Zap,
  Headphones,
  Braces,
  Binary,
  ShieldCheck,
  Regex,
  Calendar,
  Fingerprint,
  Palette,
  ImageDown,
} from '@lucide/vue';

export default {
  name: 'hr-searchbar',
  components: {
    hrButtonShortcut,

    // ICONS
    SearchIcon,
    CloseIcon,
    ChevronRight,
    ImageIcon,
    VideoIcon,
    Thermometer,
    Clock,
    Gauge,
    Zap,
    Headphones,
    Braces,
    Binary,
    ShieldCheck,
    Regex,
    Calendar,
    Fingerprint,
    Palette,
    ImageDown,
  },
  data() {
    return {
      store,
      searchQuery: '',
      selectedIndex: 0,
    };
  },
  computed: {
    allTools() {
      return Object.values(tools);
    },
    filteredTools() {
      if (!this.searchQuery) return this.allTools;
      const query = this.searchQuery.toLowerCase();
      return this.allTools.filter(
        (tool) => tool.metadata.title.toLowerCase().includes(query) || tool.metadata.description.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    handleGlobalKeydown(e) {
      // Toggle search bar with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.store.searchBar.isOpen = !this.store.searchBar.isOpen;
      }

      // Close search bar with Escape if it's open
      if (e.key === 'Escape' && this.store.searchBar.isOpen) {
        this.store.searchBar.isOpen = false;
      }
    },
    moveSelection(direction) {
      const count = this.filteredTools.length;
      if (count === 0) return;
      this.selectedIndex = (this.selectedIndex + direction + count) % count;
    },
    selectTool() {
      const tool = this.filteredTools[this.selectedIndex];
      if (tool) {
        this.$router.push('/tool/' + tool.metadata.slug);
        this.store.searchBar.isOpen = false;
      }
    },
  },
  watch: {
    'store.searchBar.isOpen': {
      handler(value) {
        if (value) {
          document.body.classList.add('overflow-hidden');
          this.searchQuery = '';
          this.selectedIndex = 0;
          this.$nextTick(() => {
            if (this.$refs.searchInput) {
              this.$refs.searchInput.focus();
            }
          });
        } else {
          document.body.classList.remove('overflow-hidden');
        }
      },
      immediate: true,
    },
    searchQuery() {
      this.selectedIndex = 0;
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleGlobalKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleGlobalKeydown);
  },
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px) scale(0.98);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
