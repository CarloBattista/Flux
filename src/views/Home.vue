<template>
  <navigation />
  <div class="relative w-full h-svh px-6">
    <div class="absolute z-0 top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <svg class="grid-bg w-full h-full" viewBox="0 0 772 880" fill="none" data-grid-size="64.33333333333333" style="">
        <g stroke="#8E48FF">
          <line x1="0.5" y1="0" x2="0.5" y2="880"></line>
          <line x1="64.5" y1="0" x2="64.5" y2="880"></line>
          <line x1="129.5" y1="0" x2="129.5" y2="880"></line>
          <line x1="193.5" y1="0" x2="193.5" y2="880"></line>
          <line x1="257.5" y1="0" x2="257.5" y2="880"></line>
          <line x1="322.5" y1="0" x2="322.5" y2="880"></line>
          <line x1="386.5" y1="0" x2="386.5" y2="880"></line>
          <line x1="450.5" y1="0" x2="450.5" y2="880"></line>
          <line x1="515.5" y1="0" x2="515.5" y2="880"></line>
          <line x1="579.5" y1="0" x2="579.5" y2="880"></line>
          <line x1="643.5" y1="0" x2="643.5" y2="880"></line>
          <line x1="708.5" y1="0" x2="708.5" y2="880"></line>
          <line x1="0" y1="43.5" x2="772" y2="43.5"></line>
          <line x1="0" y1="108.5" x2="772" y2="108.5"></line>
          <line x1="0" y1="172.5" x2="772" y2="172.5"></line>
          <line x1="0" y1="236.5" x2="772" y2="236.5"></line>
          <line x1="0" y1="301.5" x2="772" y2="301.5"></line>
          <line x1="0" y1="365.5" x2="772" y2="365.5"></line>
          <line x1="0" y1="429.5" x2="772" y2="429.5"></line>
          <line x1="0" y1="494.5" x2="772" y2="494.5"></line>
          <line x1="0" y1="558.5" x2="772" y2="558.5"></line>
          <line x1="0" y1="622.5" x2="772" y2="622.5"></line>
          <line x1="0" y1="687.5" x2="772" y2="687.5"></line>
          <line x1="0" y1="751.5" x2="772" y2="751.5"></line>
          <line x1="0" y1="815.5" x2="772" y2="815.5"></line>
          <line x1="0" y1="880.5" x2="772" y2="880.5"></line>
          <line x1="0" y1="944.5" x2="772" y2="944.5"></line>
        </g>
      </svg>
    </div>
    <div class="vignette-hero"></div>
    <div class="relative z-20 w-full h-full max-w-[1440px] mx-auto flex flex-col justify-center">
      <div class="w-full flex flex-col items-center justify-center text-center">
        <div
          class="relative mb-6 h-8 p-0.5 rounded-full flex gap-1.5 items-center border border-white/50 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
        >
          <span class="h-full py-0.5 px-2 rounded-full flex items-center justify-center bg-[#8E48FF] text-sm">{{ $t('common.explore') }}</span>
          <span class="text-sm max-one-line">{{ $t('landing.pill') }}</span>
          <ArrowRight size="16" class="mr-2" />
        </div>
        <h1 class="md:text-6xl text-3xl font-semibold text-center whitespace-nowrap">
          {{ $t('landing.headFirst') }} <br />
          {{ $t('landing.headSecond') }}
        </h1>
        <p class="w-full max-w-[500px] mt-6 text-gray-300 md:text-base text-sm font-normal text-center">{{ $t('landing.description') }}</p>
        <div v-if="false" class="w-full mt-8 flex gap-2 items-center justify-center">
          <hrButton size="large" variant="core-primary" label="Vedi prezzi" />
          <hrButton size="large" variant="secondary" label="Inizia ora" />
        </div>
      </div>
      <div v-if="false" class="relative w-full h-[78px] my-10"></div>
    </div>
  </div>
  <section class="relative w-full px-6 py-16">
    <div class="w-full max-w-[1100px] mx-auto flex flex-col gap-20">
      <div class="w-full flex items-center justify-center text-center">
        <h2 class="text-white text-4xl font-semibold">{{ $t('landing.modernTools') }}</h2>
      </div>
      <div class="card-tools-data-container relative w-full grid md:grid-cols-4 grid-cols-1">
        <div
          v-for="tool in toolsData"
          :key="tool.value"
          class="card-tools-data relative w-full px-2.5 py-7 flex flex-col gap-2 text-center md:border-r md:last:border-r-0 md:border-b-0 border-b last:border-b-0 border-white/10 hover:bg-[#8E48FF]/20"
        >
          <h2 class="text-white md:text-3xl text-base font-semibold">{{ $t(tool.title) }}</h2>
          <p class="text-white md:text-xl text-xs font-normal">{{ $t(tool.description) }}</p>
        </div>
      </div>
    </div>
  </section>
  <section class="relative w-full px-6 py-16">
    <div class="w-full max-w-[1100px] mx-auto flex flex-col gap-8">
      <div class="w-full flex items-center justify-start">
        <h2 class="text-white text-4xl font-semibold">{{ $t('landing.toolMostUsed') }}</h2>
      </div>
      <div class="w-full grid md:grid-cols-3 grid-cols-1 gap-4">
        <div v-for="tool in toolsMostUsed" :key="tool.value" class="relative w-full h-[170px] px-6 py-3 rounded-lg bg-white overflow-hidden">
          <div class="absolute z-0 top-0 right-[-100px] w-full h-full pointer-events-none">
            <img src="/_resources/imgs/card_bg.webp" alt="background" draggable="false" class="w-full h-full object-cover" />
          </div>
          <div class="relative z-10 w-full h-full flex flex-col justify-between">
            <div class="w-fit h-full max-h-11 flex items-center justify-center">
              <component :is="tool.icon" color="black" />
            </div>
            <p class="max-w-[210px] text-black text-base font-medium">{{ $t(tool.description) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  <contentInfo />
</template>

<script>
import { tools } from '../toolsRegistry';

import navigation from '../components/navigation/navigation.vue';
import hrButton from '../components/button/hr-button.vue';
import contentInfo from '../components/navigation/content-info.vue';

// ICONS
import { ArrowRight, Video as VideoIcon, Images, Shield } from '@lucide/vue';

export default {
  name: 'Home',
  components: {
    navigation,
    hrButton,
    contentInfo,

    // ICONS
    ArrowRight,
    VideoIcon,
    Images,
    Shield,
  },
  data() {
    return {
      tools,
      toolsData: [
        {
          title: '20+',
          value: '20plus',
          description: 'landing.mediaAndDevelopmentTools',
        },
        {
          title: '100%',
          value: '100percentage',
          description: 'landing.processingInBrowser',
        },
        {
          title: 'common.fast',
          value: 'fast',
          description: 'landing.optimizedConversions',
        },
        {
          title: 'landing.privacyFirst',
          value: 'privacy-first',
          description: 'landing.fileStorage',
        },
      ],
      toolsMostUsed: [
        {
          title: 'Video',
          value: 'video',
          icon: VideoIcon,
          description: 'landing.videoDesc',
        },
        {
          title: 'Images',
          value: 'images',
          icon: Images,
          description: 'landing.imagesDesc',
        },
        {
          title: 'Shield',
          value: 'shield',
          icon: Shield,
          description: 'landing.shieldDesc',
        },
      ],
    };
  },
};
</script>

<style scoped>
.grid-bg {
  transform: translateX(-10px) scale(2.5);
  filter: brightness(0.2);
}
</style>
