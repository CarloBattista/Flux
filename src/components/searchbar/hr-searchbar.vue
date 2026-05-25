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
          <div class="w-full px-4 pt-4 pb-2">
            <h2 class="text-white text-sm font-semibold brightness-50">
              {{ searchQuery ? 'Risultati di ricerca' : 'Tutti gli strumenti' }}
            </h2>
          </div>
          <div v-if="filteredTools.length > 0" class="p-2">
            <!-- Grouped View (No Search) -->
            <template v-if="!searchQuery">
              <!-- Favorites Tools section -->
              <div v-if="favoritesTools.length > 0" class="mb-4">
                <div class="px-3 py-2">
                  <span class="text-[10px] text-white/30 font-bold uppercase tracking-wider">Preferiti</span>
                </div>
                <RouterLink
                  v-for="(tool, index) in favoritesTools"
                  :key="'favorite-' + tool.metadata.slug"
                  :to="'/tool/' + tool.metadata.slug"
                  @click="
                    store.searchBar.isOpen = false;
                    actionHandleTool(tool);
                  "
                >
                  <cardTool
                    :keyCard="index"
                    :selectedIndex="selectedfavoriteIndex"
                    :icon="tool.metadata.icon"
                    :firstLine="tool.metadata.title"
                    :secondLine="tool.metadata.description"
                    :badge="tool.metadata.new"
                    :action="true"
                    @mouseenter="selectedfavoriteIndex = index"
                    :class="[index === selectedfavoriteIndex ? 'bg-white/10' : 'hover:bg-white/5']"
                  />
                </RouterLink>
              </div>

              <!-- Recent Tools Section -->
              <div v-if="recentTools.length > 0" class="mb-4">
                <div class="px-3 py-2">
                  <span class="text-[10px] text-white/30 font-bold uppercase tracking-wider">Recenti</span>
                </div>
                <RouterLink
                  v-for="(tool, index) in recentTools"
                  :key="'recent-' + tool.metadata.slug"
                  :to="'/tool/' + tool.metadata.slug"
                  @click="
                    store.searchBar.isOpen = false;
                    actionHandleTool(tool);
                  "
                >
                  <cardTool
                    :keyCard="index"
                    :selectedIndex="selectedIndex"
                    :icon="tool.metadata.icon"
                    :firstLine="tool.metadata.title"
                    :secondLine="tool.metadata.description"
                    :badge="tool.metadata.new"
                    :action="true"
                    @mouseenter="selectedIndex = index"
                    :class="[index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5']"
                  />
                </RouterLink>
              </div>

              <div v-for="(category, catId) in categories" :key="catId" class="mb-4 last:mb-0">
                <div class="px-3 py-2">
                  <span class="text-[10px] font-bold text-white/30 uppercase tracking-wider">{{ category.label }}</span>
                </div>
                <RouterLink
                  v-for="(tool, index) in category.tools"
                  :key="tool.metadata.slug"
                  :to="'/tool/' + tool.metadata.slug"
                  @click="
                    store.searchBar.isOpen = false;
                    actionHandleTool(tool);
                  "
                >
                  <cardTool
                    :keyCard="index"
                    :selectedIndex="selectedIndex"
                    :icon="tool.metadata.icon"
                    :firstLine="tool.metadata.title"
                    :secondLine="tool.metadata.description"
                    :badge="tool.metadata.new"
                    :action="navigationTools.indexOf(tool) === selectedIndex"
                    @mouseenter="selectedIndex = navigationTools.indexOf(tool)"
                    :class="[navigationTools.indexOf(tool) === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5']"
                  />
                </RouterLink>
              </div>
            </template>

            <!-- Flat View (With Search) -->
            <template v-else>
              <RouterLink
                v-for="(tool, index) in filteredTools"
                :key="tool.metadata.slug"
                :to="'/tool/' + tool.metadata.slug"
                @click="
                  store.searchBar.isOpen = false;
                  actionHandleTool(tool);
                "
              >
                <cardTool
                  :keyCard="index"
                  :selectedIndex="selectedIndex"
                  :icon="tool.metadata.icon"
                  :firstLine="tool.metadata.title"
                  :secondLine="tool.metadata.description"
                  :badge="tool.metadata.new"
                  :action="navigationTools.indexOf(tool) === selectedIndex"
                  @mouseenter="selectedIndex = navigationTools.indexOf(tool)"
                  :class="[selectedIndex === index ? 'bg-white/10' : 'hover:bg-white/5']"
                />
              </RouterLink>
            </template>
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
import { getRecentTools, handleTool } from '../../api/userTools';

import hrButtonShortcut from '../button/hr-button-shortcut.vue';
import cardTool from '../card/card-tool.vue';

// ICONS
import { Search as SearchIcon, X as CloseIcon } from '@lucide/vue';

export default {
  name: 'hr-searchbar',
  components: {
    hrButtonShortcut,
    cardTool,

    // ICONS
    SearchIcon,
    CloseIcon,
  },
  data() {
    return {
      store,
      searchQuery: '',
      selectedIndex: 0,
      selectedfavoriteIndex: null,
      categories: {
        media: {
          label: 'Media',
          tools: [
            tools['image-converter'],
            tools['image-compressor'],
            tools['video-converter'],
            tools['video-compressor'],
            tools['video-to-gif'],
            tools['video-watermark'],
            tools['audio-converter'],
            tools['image-resizer'],
          ],
        },
        units: {
          label: 'Unità',
          tools: [tools.temperature, tools.time, tools.velocity, tools['data-transfer-rate']],
        },
        devtools: {
          label: 'DevTools',
          tools: [
            tools['json-formatter'],
            tools['base64-converter'],
            tools['jwt-decoder'],
            tools['jwt-encoder'],
            tools['regex-tester'],
            tools['timestamp-converter'],
            tools['uuid-generator'],
            tools['color-picker-converter'],
          ],
        },
      },
      maxRecentTools: 4,
    };
  },
  computed: {
    recentTools() {
      if (!this.store.recentTools.data) return [];
      // Map slugs to actual tool objects from registry, limiting to 4
      return this.store.recentTools.data.map((item) => tools[item.tool_slug]).filter((tool) => !!tool);
    },
    favoritesTools() {
      if (!this.store.favorites.data) return [];

      return this.store.favorites.data.map((item) => tools[item.tool_slug]).filter((tool) => !!tool);
    },
    navigationTools() {
      // Tools list used for keyboard navigation index
      if (!this.searchQuery) {
        return [...this.recentTools, ...this.allTools];
      }
      return this.filteredTools;
    },
    allTools() {
      // Return tools in the order defined by categories
      const orderedTools = [];
      Object.values(this.categories).forEach((category) => {
        orderedTools.push(...category.tools);
      });
      return orderedTools;
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
      const isModifierPressed = this.store.isMac ? e.metaKey : e.ctrlKey;
      if (isModifierPressed && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.store.searchBar.isOpen = !this.store.searchBar.isOpen;
      }

      // Close search bar with Escape if it's open
      if (e.key === 'Escape' && this.store.searchBar.isOpen) {
        this.store.searchBar.isOpen = false;
      }
    },
    moveSelection(direction) {
      const count = this.navigationTools.length;
      if (count === 0) return;
      this.selectedIndex = (this.selectedIndex + direction + count) % count;
    },
    selectTool() {
      const tool = this.navigationTools[this.selectedIndex];
      if (tool) {
        this.$router.push('/tool/' + tool.metadata.slug);
        this.store.searchBar.isOpen = false;
        handleTool(tool);
      }
    },
    actionHandleTool(tool) {
      if (!tool) return;

      handleTool(tool);
    },
  },
  watch: {
    'store.searchBar.isOpen': {
      handler(value) {
        if (value) {
          document.body.classList.add('overflow-hidden');
          this.searchQuery = '';
          this.selectedIndex = 0;
          getRecentTools(this.maxRecentTools);
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
