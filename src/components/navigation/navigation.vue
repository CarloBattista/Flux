<template>
  <div
    class="nav fixed z-9999 top-0 left-0 w-full h-14 px-6 flex items-center"
    :class="{ 'nav-active': viewedScrolled || burger.isOpen, 'nav-active-scrolled': viewedScrolled || burger.isOpen }"
  >
    <div class="h-full flex flex-1 gap-3 items-center justify-start">
      <RouterLink to="/">
        <appLogo class="relative h-5" />
      </RouterLink>
      <hrBadge v-if="store.featureFlags?.beta_access" variant="beta" label="BETA" />
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
      <div class="nav-item">
        <div class="flex gap-1 items-center">
          <div
            @click="store.searchBar.isOpen = !store.searchBar.isOpen"
            class="relative h-8 aspect-square rounded-xl flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors duration-200"
          >
            <SearchIcon size="18" class="nav-icon" />
          </div>
          <hrButtonShortcut :icon="store.isMac ? '⌘ K' : 'Ctrl K'" />
        </div>
      </div>
    </div>
    <div class="h-full flex flex-1 gap-1 items-center justify-end">
      <RouterLink v-if="!isSubscribed && false" to="/pricing">
        <hrButton size="small" variant="core-primary" label="Abbonati ora" class="mr-4" />
      </RouterLink>
      <RouterLink v-if="!authStore.isAuthenticated" to="/signin">
        <hrButton size="small" variant="core-primary" label="Accedi" class="mr-4" />
      </RouterLink>
      <div
        @click="store.searchBar.isOpen = !store.searchBar.isOpen"
        class="relative h-10 aspect-square rounded-2xl md:hidden flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors duration-200"
      >
        <SearchIcon />
      </div>
      <div
        @click="burger.isOpen = !burger.isOpen"
        class="relative h-10 aspect-square rounded-2xl md:hidden flex items-center justify-center cursor-pointer"
      >
        <MenuIcon v-if="!burger.isOpen" />
        <CloseIcon v-else />
      </div>
      <RouterLink v-if="authStore.isAuthenticated" to="/profile/overview" class="nav-item">
        <div class="h-8 ml-1 aspect-square rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <UserIcon size="18" class="text-white" />
        </div>
      </RouterLink>
    </div>
  </div>

  <Transition name="mobile-menu">
    <div v-if="burger.isOpen" class="fixed z-9998 top-14 left-0 w-full h-[calc(100vh-3.5rem)] bg-[#080808] md:hidden overflow-y-auto px-6 py-8">
      <div class="flex flex-col gap-8">
        <template v-if="!burger.activeCategory">
          <RouterLink to="/" class="text-2xl font-semibold text-white" @click="burger.isOpen = false"> Home </RouterLink>

          <div
            v-for="(category, key) in categories"
            :key="key"
            class="flex items-center justify-between group cursor-pointer"
            @click="burger.activeCategory = key"
          >
            <span class="text-2xl font-semibold text-white group-hover:text-[#8e48ff] transition-colors">{{ category.label }}</span>
            <ChevronRight class="text-white" />
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col gap-6">
            <div class="flex flex-col gap-4">
              <div class="flex gap-2 items-center">
                <button
                  @click="burger.activeCategory = null"
                  type="button"
                  class="relative h-11 aspect-square rounded-full flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft size="28" />
                </button>
                <h3 class="text-white text-3xl font-bold">{{ categories[burger.activeCategory].label }}</h3>
              </div>
              <div class="grid grid-cols-1 gap-2">
                <RouterLink
                  v-for="tool in categories[burger.activeCategory].tools"
                  :key="tool.metadata.slug"
                  :to="'/tool/' + tool.metadata.slug"
                  class="w-full h-14 p-3 rounded-2xl flex gap-4 items-center bg-white/5 hover:bg-white/10 transition-colors"
                  @click="
                    burger.isOpen = false;
                    burger.activeCategory = null;
                    actionHandleTool(tool);
                  "
                >
                  <div class="h-full aspect-square rounded-xl flex items-center justify-center bg-white/10 text-white/70">
                    <component :is="tool.metadata.icon" size="20" />
                  </div>
                  <div class="w-full min-w-0 flex flex-row gap-2">
                    <span class="text-white font-medium max-one-line">{{ tool.metadata.title }}</span>
                    <hrBadge v-if="tool.metadata.new" variant="success" label="New" />
                    <hrBadge v-if="tool.metadata.access === 'plus'" variant="plus" label="Plus" />
                  </div>
                </RouterLink>
              </div>
            </div>
          </div>
        </template>

        <div class="flex flex-col gap-3 pt-4">
          <hrButton v-if="false" variant="secondary" label="Vedi prezzi" class="w-full" />
          <RouterLink v-if="!authStore.isAuthenticated" to="/signin">
            <hrButton variant="core-primary" label="Accedi" class="w-full" />
          </RouterLink>
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
            @click="
              dropdown.isOpen = false;
              actionHandleTool(tool);
            "
          >
            <div class="h-full aspect-square rounded-xl flex flex-none items-center justify-center bg-white/10 text-white/70">
              <component :is="tool.metadata.icon" size="18" />
            </div>
            <div class="w-full min-w-0 flex flex-row items-center gap-2">
              <h2 class="text-white text-sm font-medium max-one-line">{{ tool.metadata.title }}</h2>
              <hrBadge v-if="tool.metadata.new" variant="success" label="New" />
              <hrBadge v-if="tool.metadata.access === 'plus'" variant="plus" label="Plus" />
            </div>
          </RouterLink>
        </section>
      </div>
    </div>
  </Transition>
</template>

<script>
import { categories } from '../../data/categories';
import { store } from '../../data/store';
import { authStore } from '../../data/authStore';
import { handleTool } from '../../api/userTools';
import { isSubscribed } from '../../api/subscription';

import appLogo from '../global/app-logo.vue';
import hrButton from '../button/hr-button.vue';
import hrButtonShortcut from '../button/hr-button-shortcut.vue';
import hrBadge from '../badge/hr-badge.vue';

// ICONS
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
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
  ShieldAlert,
  Regex,
  Calendar,
  Fingerprint,
  Palette,
  ImageDown,
  Search as SearchIcon,
  User as UserIcon,
  Maximize,
} from '@lucide/vue';

export default {
  name: 'navigation',
  components: {
    appLogo,
    hrButton,
    hrButtonShortcut,
    hrBadge,

    // ICONS
    ChevronDown,
    ChevronRight,
    ChevronLeft,
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
    ShieldAlert,
    Regex,
    Calendar,
    Fingerprint,
    Palette,
    ImageDown,
    SearchIcon,
    UserIcon,
    Maximize,
  },
  data() {
    return {
      store,
      authStore,
      categories,

      dropdown: {
        isOpen: false,
        menu: '',
      },
      burger: {
        isOpen: false,
        activeCategory: null,
      },

      dropdownTimer: null,
      viewedScrolled: false,
    };
  },
  computed: {
    isSubscribed() {
      return isSubscribed();
    },
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
    handleResize() {
      if (!this.burger.isOpen) return;

      if (window.innerWidth > 768) {
        this.burger.isOpen = false;
        this.burger.activeCategory = null;
        document.body.classList.remove('overflow-hidden');
      }
    },
    actionHandleTool(tool) {
      if (!tool) return;

      handleTool(tool);
    },
  },
  watch: {
    'burger.isOpen': {
      handler(value) {
        if (value) {
          document.body.classList.add('overflow-hidden');
        } else {
          document.body.classList.remove('overflow-hidden');
          this.burger.activeCategory = null;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.handleScroll();
    this.handleResize();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  },
};
</script>

<style scoped>
.nav {
  transition-property: background-color, backdrop-filter;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}

.nav-active:not(.nav-active-scrolled) {
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(18px);
}

.nav-active-scrolled {
  background-color: black;
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
