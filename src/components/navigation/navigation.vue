<template>
  <div class="nav fixed z-9999 top-0 left-0 w-full h-14 px-6 flex items-center" :class="{ 'nav-active': viewedScrolled }">
    <div class="h-full flex flex-1 items-center justify-start">
      <RouterLink to="/">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 449 71" class="h-[17px] w-auto md:h-[20px]">
          <path
            fill="currentColor"
            d="m.032 70 12.192-52.704q1.536-6.432 4.608-10.08 3.072-3.744 7.488-5.28Q28.736.304 34.208.304q3.648 0 6.528.672t4.608 1.728l-3.648 10.464q-.864-.48-2.304-.864-1.344-.384-3.36-.384-3.744 0-5.664 1.44-1.92 1.344-2.688 4.992l-1.536 6.528.096 2.688L16.352 70zm0-36.384L2.72 22h37.44l-2.688 11.616zM33.245 70l11.136-48h14.496l-2.976 17.472-.672-1.632q1.536-5.088 4.032-8.832t6.144-5.856 8.256-2.112q1.632 0 2.688.288 1.152.192 1.92.576l-3.936 13.728q-.96-.48-2.304-.672-1.248-.288-3.264-.288-2.976 0-5.856 1.344-2.784 1.248-4.896 4.128c-2.112 2.88-2.496 4.48-3.264 7.68L49.565 70zm56.831.864q-4.8 0-8.64-2.208-3.744-2.304-5.952-6.528-2.112-4.32-2.112-10.56 0-5.76 1.632-11.232t4.704-9.792q3.168-4.416 7.488-6.912 4.416-2.592 9.888-2.592 3.168 0 6.048 1.152 2.976 1.152 4.992 3.552 2.112 2.4 2.88 6.336L113.308 22h16.32l-11.136 48h-14.784l1.632-9.024q-2.304 4.608-6.336 7.296-4.032 2.592-8.928 2.592M97.18 58.96q2.4 0 4.416-1.536t3.456-4.032a21.3 21.3 0 0 0 2.304-5.568q.864-3.072.864-6.048 0-2.688-.96-4.608-.864-2.016-2.496-3.072t-3.936-1.056q-2.688 0-4.8 1.632-2.112 1.536-3.552 4.032t-2.208 5.472q-.768 2.88-.768 5.568 0 2.88.864 4.992.864 2.016 2.496 3.168 1.728 1.056 4.32 1.056M126.86 70l11.136-48h14.496l-2.4 15.264-.864-1.344q2.016-7.2 7.008-11.04 5.088-3.84 11.808-3.84 5.088 0 8.448 2.304 3.456 2.208 4.8 6.432 1.44 4.128 0 9.984L174.284 70h-16.32l6.624-28.224q.864-3.84-.672-6.048-1.44-2.208-4.704-2.208-2.496 0-4.512 1.248-2.016 1.152-3.36 3.552-1.344 2.304-2.112 5.76L143.18 70zm62.208 0 6.624-28.224q.864-3.84-.672-6.048-1.44-2.208-4.704-2.208-2.496 0-4.512 1.248-2.016 1.152-3.36 3.552-1.344 2.304-2.112 5.76l-.96-7.2q2.304-7.68 7.488-11.712 5.184-4.128 12-4.128 5.184 0 8.64 2.304 3.552 2.208 4.896 6.432 1.44 4.128 0 9.984L205.388 70zm51.328.864q-7.104 0-12.48-2.688-5.376-2.784-8.352-7.68t-2.976-11.424q0-8.064 3.264-14.304 3.36-6.336 9.408-9.984 6.144-3.648 14.592-3.648 7.008 0 11.904 2.688 4.992 2.592 7.584 7.392t2.592 11.328q0 1.824-.192 3.84a20.4 20.4 0 0 1-.768 3.936h-37.824v-8.832h27.168l-4.512 2.496q.384-1.344.48-2.304t.096-1.824q0-2.496-.864-4.128t-2.4-2.4q-1.536-.864-3.648-.864-3.456 0-5.76 1.632-2.208 1.632-3.552 4.32-1.344 2.592-1.92 5.664a38.6 38.6 0 0 0-.48 5.952q0 3.072 1.152 5.184 1.248 2.112 3.264 3.264 2.112 1.056 4.896 1.056 3.456 0 5.568-1.536a11.1 11.1 0 0 0 3.264-4.032l13.44 5.28q-1.632 3.648-5.088 6.24-3.36 2.592-7.968 4.032-4.512 1.344-9.888 1.344m66.435-49.728q4.704 0 8.256 2.208 3.552 2.112 5.568 6.432 2.016 4.224 2.016 10.56 0 5.76-1.632 11.232t-4.704 9.888q-2.976 4.32-7.2 6.912-4.128 2.592-9.312 2.592-3.456 0-6.624-1.152-3.168-1.248-5.376-3.648t-2.976-6.144L282.255 70h-15.936l15.84-68.352h16.32l-6.432 28.032q2.4-3.936 6.24-6.24 3.936-2.304 8.544-2.304m-11.52 37.824q2.592 0 4.608-1.536 2.112-1.632 3.552-4.032 1.44-2.496 2.208-5.472.864-2.976.864-5.76 0-2.976-.96-4.992-.864-2.016-2.592-2.976-1.632-1.056-3.936-1.056-2.592 0-4.704 1.536-2.016 1.44-3.552 3.936-1.44 2.496-2.208 5.568a25.3 25.3 0 0 0-.768 6.144q0 3.936 1.92 6.336 1.92 2.304 5.568 2.304m49.072-42.528q-4.224 0-6.624-1.728-2.304-1.728-1.824-5.568.48-4.416 2.976-6.336 2.496-2.016 7.008-2.016 4.32 0 6.624 1.824 2.4 1.824 1.92 5.376-.48 4.704-3.072 6.624-2.496 1.824-7.008 1.824M350.335 22l-11.136 48h-16.32l11.136-48zm-2.776 48 11.136-48h14.496l-2.976 17.472-.672-1.632q1.536-5.088 4.032-8.832t6.144-5.856 8.256-2.112q1.632 0 2.688.288 1.152.192 1.92.576l-3.936 13.728q-.96-.48-2.304-.672-1.248-.288-3.264-.288-2.976 0-5.856 1.344-2.784 1.248-4.896 4.128c-2.112 2.88-2.496 4.48-3.264 7.68L363.879 70zm56.831.864q-4.8 0-8.64-2.208-3.744-2.304-5.952-6.528-2.112-4.32-2.112-10.56 0-5.76 1.632-11.232t4.704-9.792q3.168-4.416 7.488-6.912 4.416-2.592 9.888-2.592 3.168 0 6.048 1.152 2.976 1.152 4.992 3.552 2.112 2.4 2.88 6.336l7.008-30.432h16.32L432.806 70h-14.784l1.632-9.024q-2.304 4.608-6.336 7.296-4.032 2.592-8.928 2.592m7.104-11.904q2.4 0 4.416-1.536t3.456-4.032a21.3 21.3 0 0 0 2.304-5.568q.864-3.072.864-6.048 0-2.688-.96-4.608-.864-2.016-2.496-3.072t-3.936-1.056q-2.688 0-4.8 1.632-2.112 1.536-3.552 4.032t-2.208 5.472q-.768 2.88-.768 5.568 0 2.88.864 4.992.864 2.016 2.496 3.168 1.728 1.056 4.32 1.056"
          ></path>
        </svg>
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

import hrButton from '../button/hr-button.vue';

// ICONS
import { ChevronDown, Image as ImageIcon, Video as VideoIcon, Thermometer, Clock, Gauge, Zap, Menu as MenuIcon, X as CloseIcon } from '@lucide/vue';

export default {
  name: 'navigation',
  components: {
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
          tools: [tools['image-converter'], tools['video-converter']],
        },
        units: {
          label: 'Unità',
          tools: [tools.temperature, tools.time, tools.velocity, tools['data-transfer-rate']],
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
