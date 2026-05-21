<template>
  <div class="nav fixed z-9999 top-0 left-0 w-full h-14 px-6 flex items-center" :class="{ 'nav-active': viewedScrolled }">
    <div class="h-full flex flex-1 items-center justify-start">
      <RouterLink to="/">
        <appLogo class="relative h-5" />
      </RouterLink>
    </div>
    <div class="h-full md:flex hidden gap-6 items-center justify-center">
      <RouterLink to="/" class="nav-item">
        <span class="nav-label">Home</span>
      </RouterLink>
      <div
        v-for="(category, key) in categories"
        :key="key"
        @mouseenter="navMouseEnter(key)"
        @mouseleave="navMouseLeave"
        class="nav-item"
        :class="{ 'nav-open': dropdown.isOpen && dropdown.menu === key }"
      >
        <span class="nav-label">{{ category.label }}</span>
        <ChevronDown size="18" class="nav-icon" />
      </div>
    </div>
    <div class="h-full md:flex hidden flex-1 gap-3 items-center justify-end">
      <hrButton v-if="false" variant="primary" label="Vedi prezzi" />
      <hrButton v-if="false" variant="secondary" label="Inizia ora" />
    </div>
    <div
      @click="burger.isOpen = !burger.isOpen"
      class="relative h-10 aspect-square rounded-2xl md:hidden flex items-center justify-center cursor-pointer"
    >
      <MenuIcon v-if="!burger.isOpen" />
      <CloseIcon v-else />
    </div>
  </div>

  <Transition name="mobile-menu">
    <div v-if="burger.isOpen" class="fixed z-9998 top-14 left-0 w-full h-[calc(100vh-3.5rem)] bg-[#080808] md:hidden overflow-y-auto px-6 py-8">
      <div class="flex flex-col gap-8">
        <RouterLink to="/" class="text-2xl font-semibold text-white" @click="burger.isOpen = false"> Home </RouterLink>

        <div v-for="(category, key) in categories" :key="key" class="flex flex-col gap-4">
          <h3 class="text-white/50 text-xs font-bold uppercase tracking-wider">{{ category.label }}</h3>
          <div class="grid grid-cols-1 gap-2">
            <RouterLink
              v-for="tool in category.tools"
              :key="tool.metadata.slug"
              :to="'/tool/' + tool.metadata.slug"
              class="w-full h-14 p-3 rounded-2xl flex gap-4 items-center bg-white/5 hover:bg-white/10 transition-colors"
              @click="burger.isOpen = false"
            >
              <div class="h-full aspect-square rounded-xl flex items-center justify-center bg-white/10 text-white/70">
                <component :is="tool.metadata.icon" size="20" />
              </div>
              <span class="text-white font-medium">{{ tool.metadata.title }}</span>
            </RouterLink>
          </div>
        </div>

        <div v-if="false" class="flex flex-col gap-3 pt-4">
          <hrButton variant="primary" label="Vedi prezzi" class="w-full justify-center" />
          <hrButton variant="secondary" label="Inizia ora" class="w-full justify-center" />
        </div>
      </div>
    </div>
  </Transition>

  <Transition name="appear-fade">
    <div
      v-if="dropdown.isOpen && currentCategory"
      class="fixed z-999 top-14 left-0 w-full px-6"
      @mouseenter="dropdownMouseEnter"
      @mouseleave="navMouseLeave"
    >
      <div class="max-w-[640px] p-4 mx-auto rounded-3xl border border-solid border-white/10 bg-black shadow-2xl shadow-white/2">
        <section class="w-full h-full grid grid-cols-2 gap-4">
          <RouterLink
            v-for="tool in currentCategory.tools"
            :key="tool.metadata.slug"
            :to="'/tool/' + tool.metadata.slug"
            class="w-full h-12 p-2 rounded-2xl flex gap-3 items-center bg-black hover:bg-white/15 transition-colors duration-100 cursor-pointer"
            @click="dropdown.isOpen = false"
          >
            <div class="h-full aspect-square rounded-xl flex flex-none items-center justify-center bg-white/10 text-white/70">
              <component :is="tool.metadata.icon" size="18" />
            </div>
            <div class="w-full flex flex-row gap-2">
              <h2 class="text-white text-sm font-medium">{{ tool.metadata.title }}</h2>
              <span v-if="tool.metadata.new" class="w-fit bg-green-600/40 text-green-400 text-xs font-medium py-0.5 px-1 rounded-[6px]">New</span>
            </div>
          </RouterLink>
        </section>
      </div>
    </div>
  </Transition>
</template>

<script>
import { tools } from '../../toolsRegistry';

import appLogo from '../global/app-logo.vue';
import hrButton from '../button/hr-button.vue';

// ICONS
import {
  ChevronDown,
  Image as ImageIcon,
  Video as VideoIcon,
  Thermometer,
  Clock,
  Gauge,
  Zap,
  Menu as MenuIcon,
  X as CloseIcon,
  Headphones,
  Braces,
  Binary,
  ShieldCheck,
  Regex,
} from '@lucide/vue';

export default {
  name: 'navigation',
  components: {
    appLogo,
    hrButton,

    // ICONS
    ChevronDown,
    ImageIcon,
    VideoIcon,
    Thermometer,
    Clock,
    Gauge,
    Zap,
    MenuIcon,
    CloseIcon,
    Headphones,
    Braces,
    Binary,
    ShieldCheck,
    Regex,
  },
  data() {
    return {
      dropdown: {
        isOpen: false,
        menu: '',
      },
      categories: {
        media: {
          label: 'Media',
          tools: [tools['image-converter'], tools['video-converter'], tools['audio-converter']],
        },
        units: {
          label: 'Unità',
          tools: [tools.temperature, tools.time, tools.velocity, tools['data-transfer-rate']],
        },
        devtools: {
          label: 'DevTools',
          tools: [tools['json-formatter'], tools['base64-converter'], tools['jwt-decoder'], tools['regex-tester']],
        },
      },
      burger: {
        isOpen: false,
      },

      dropdownTimer: null,
      viewedScrolled: false,
    };
  },
  computed: {
    currentCategory() {
      return this.categories[this.dropdown.menu] || null;
    },
  },
  methods: {
    navMouseEnter(menu) {
      if (this.dropdownTimer) clearTimeout(this.dropdownTimer);

      if (this.dropdown.isOpen) {
        this.dropdown.menu = menu;
      } else {
        this.dropdownTimer = setTimeout(() => {
          this.dropdown.menu = menu;
          this.dropdown.isOpen = true;
        }, 150);
      }
    },
    navMouseLeave() {
      if (this.dropdownTimer) clearTimeout(this.dropdownTimer);

      this.dropdownTimer = setTimeout(() => {
        this.dropdown.isOpen = false;
        this.dropdown.menu = '';
      }, 200);
    },
    dropdownMouseEnter() {
      if (this.dropdownTimer) clearTimeout(this.dropdownTimer);
    },
    handleScroll() {
      if (window.scrollY > 0) {
        this.viewedScrolled = true;
      } else {
        this.viewedScrolled = false;
      }
    },
  },
  watch: {
    'burger.isOpen'(val) {
      if (val) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
  },
  mounted() {
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>

<style scoped>
.nav {
  transition-property: background-color, backdrop-filter;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

.nav-active {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(18px);
}

.nav-item {
  height: 100%;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.nav-icon {
  transition-property: transform;
  transition-duration: 150ms;
  transform-style: 250ms;
  transition-timing-function: ease-in-out;
}

.nav-item.nav-open .nav-icon {
  transform: rotate(180deg);
}

.appear-fade-enter-active,
.appear-fade-leave-active {
  transition: all 250ms cubic-bezier(0.215, 0.61, 0.355, 1);
  transform-origin: top center;
}

.appear-fade-enter-from,
.appear-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 300ms ease-in-out;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
