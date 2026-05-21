<template>
  <navigation />
  <div class="relative w-full px-6">
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
    <div class="relative z-20 w-full h-full max-w-[1440px] mx-auto flex flex-col justify-start md:pt-[10%] pt-[20%]">
      <div class="w-full flex flex-col items-center justify-center text-center">
        <h1 class="text-6xl font-semibold text-center whitespace-nowrap">Pricing</h1>
        <p class="w-full max-w-[500px] mt-6 text-gray-300 md:text-base text-sm font-normal text-center">
          Strumenti veloci e moderni per convertire immagini, video, audio, file e dati direttamente nel browser.
        </p>
      </div>
      <div class="relative w-full max-w-[768px] mx-auto mt-14">
        <div class="grid md:grid-cols-2 grid-cols-1 gap-6">
          <div
            v-for="plan in store.plans"
            :key="plan.id"
            class="card-plan w-full py-6 px-4"
            :class="{ 'plus-card': plan.name === 'Plus', 'md:order-0 order-2': plan.name === 'Free' }"
          >
            <div class="w-full mb-10 flex gap-3 items-center">
              <h3 class="text-2xl font-semibold">{{ plan.name }}</h3>
              <span v-if="plan.name === 'Plus'" class="py-1 px-2 rounded-full text-sm font-medium border border-[#8E48FF] bg-[#8E48FF]/50"
                >Scelta consigliata</span
              >
            </div>
            <div class="w-full mb-8 flex flex-col gap-2">
              <div class="w-full flex items-end">
                <div class="text-5xl font-semibold flex items-start">
                  <span class="text-lg font-medium brightness-50">&euro;</span>{{ plan.price }}
                </div>
                <span class="text-base font-medium ml-2">/{{ plan.type }}</span>
              </div>
              <p>{{ plan.description }}</p>
            </div>
            <div class="w-full flex gap-2 items-center">
              <hrButton
                size="large"
                :variant="plan.name === 'Free' ? 'tertiary' : 'core-primary'"
                :label="plan.name === 'Free' ? 'Il tuo piano attuale' : `Fai l'upgrade a ${plan.name}`"
                :disabled="plan.name === 'Free'"
                class="w-full"
              />
            </div>
            <div class="w-full mt-16 flex flex-col">
              <h2 class="text-base font-medium">Cosa include</h2>
              <div class="w-full mt-2 flex flex-col gap-1 text-sm font-normal">
                <div v-for="feature in plan.features" :key="feature" class="px-4 flex gap-2 items-center">
                  <span>{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="relative w-full h-[150px]"></div>
</template>

<script>
import { tools } from '../toolsRegistry';
import { store } from '../data/store';

import navigation from '../components/navigation/navigation.vue';
import hrButton from '../components/button/hr-button.vue';

export default {
  name: 'Pricing',
  components: {
    navigation,
    hrButton,
  },
  data() {
    return {
      tools,
      store,
    };
  },
};
</script>

<style scoped>
.grid-bg {
  transform: translateX(-10px) scale(2.5);
  filter: brightness(0.2);
}

.card-plan {
  position: relative;
  border-radius: 16px;
  background-color: #1b1b1b;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.card-plan.plus-card {
  background: #1b1b1b;
  background: linear-gradient(60deg, rgba(27, 27, 27, 1) 0%, rgba(67, 29, 128, 1) 100%);
}
</style>
