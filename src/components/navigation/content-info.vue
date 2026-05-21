<template>
  <div class="relative z-9999 bottom-0 left-0 w-full md:py-20 md:px-32 py-6 px-6 border-t border-white/10">
    <div class="w-full flex gap-6">
      <div class="w-[35%] h-full flex flex-none flex-col">
        <appLogo variant="white" class="relative w-fit h-7" />
        <div class="mt-9 flex gap-4 items-center">
          <a href="https://github.com/CarloBattista" target="_blank" class="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 1024 1024" fill="none">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
                transform="scale(64)"
                fill="#fff"
              />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/carlo-battista-05b926282/" target="_blank" class="social-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              fill="#fff"
              width="18"
              height="18"
              version="1.1"
              id="Capa_1"
              viewBox="0 0 260.366 260.366"
              xml:space="preserve"
            >
              <g>
                <path
                  d="M34.703,0.183C15.582,0.183,0.014,15.748,0,34.884C0,54.02,15.568,69.588,34.703,69.588   c19.128,0,34.688-15.568,34.688-34.704C69.391,15.75,53.83,0.183,34.703,0.183z"
                />
                <path
                  d="M60.748,83.531H8.654c-2.478,0-4.488,2.009-4.488,4.489v167.675c0,2.479,2.01,4.488,4.488,4.488h52.093   c2.479,0,4.489-2.01,4.489-4.488V88.02C65.237,85.539,63.227,83.531,60.748,83.531z"
                />
                <path
                  d="M193.924,81.557c-19.064,0-35.817,5.805-46.04,15.271V88.02c0-2.48-2.01-4.489-4.489-4.489H93.424   c-2.479,0-4.489,2.009-4.489,4.489v167.675c0,2.479,2.01,4.488,4.489,4.488h52.044c2.479,0,4.489-2.01,4.489-4.488v-82.957   c0-23.802,4.378-38.555,26.227-38.555c21.526,0.026,23.137,15.846,23.137,39.977v81.535c0,2.479,2.01,4.488,4.49,4.488h52.068   c2.478,0,4.488-2.01,4.488-4.488v-91.977C260.366,125.465,252.814,81.557,193.924,81.557z"
                />
              </g>
            </svg>
          </a>
        </div>
        <p class="mt-20 text-sm font-normal brightness-50">&copy; {{ currentYear }} Flux, All rights reserved.</p>
      </div>
      <div class="w-full h-full grid lg:grid-cols-4 grid-cols-2 gap-6">
        <div class="w-full flex flex-none flex-col gap-3">
          <h2 class="footer-nav-head text-sm font-medium brightness-50">Azienda</h2>
          <div class="w-full flex flex-col">
            <a href="#" target="_blank" class="footer-nav">Chi siamo</a>
            <a href="#" target="_blank" class="footer-nav">Sicurezza</a>
            <a href="#" target="_blank" class="footer-nav">Termini e privacy</a>
          </div>
        </div>
        <div class="w-full flex flex-none flex-col gap-3">
          <h2 class="footer-nav-head text-sm font-medium brightness-50">Scarica</h2>
          <div class="w-full flex flex-col">
            <a href="#" target="_blank" class="footer-nav">iOS e Android</a>
            <a href="#" target="_blank" class="footer-nav">Mac e Windows</a>
          </div>
        </div>
        <div class="w-full flex flex-none flex-col gap-3">
          <h2 class="footer-nav-head text-sm font-medium brightness-50">Risorse</h2>
          <div class="w-full flex flex-col">
            <a href="#" target="_blank" class="footer-nav">Centro assistenza</a>
            <a href="#" target="_blank" class="footer-nav">Prezzi</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appLogo from '../global/app-logo.vue';

export default {
  name: 'content-info',
  components: {
    appLogo,
  },
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>

<style scoped>
.social-icon {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(0.5);
  transition: filter 200ms ease-in-out;
}

.social-icon:hover {
  filter: brightness(1);
}

.footer-nav {
  font-size: 1rem;
  font-weight: 400;
}

.footer-nav:hover {
  text-decoration: underline;
}
</style>
