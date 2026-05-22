<template>
  <div class="relative w-full h-svh flex">
    <div class="relative z-0 w-full h-full md:flex hidden p-4 pointer-events-none">
      <div class="relative w-full h-full rounded-2xl">
        <img src="/_resources/imgs/background_2.webp" class="relative z-20 w-full h-full rounded-2xl object-cover" />
        <img src="/_resources/imgs/background_2.webp" class="blurred-image absolute z-10 top-0 left-0 w-full h-full rounded-2xl object-cover" />
      </div>
    </div>
    <div class="relative z-10 w-full md:max-w-[45%] h-full px-6">
      <div class="absolute top-4 md:left-2 left-6">
        <RouterLink
          to="/signin"
          type="button"
          class="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white/70 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <span class="text-xs font-bold">Torna indietro</span>
        </RouterLink>
      </div>
      <div class="w-full h-full sm:max-w-[400px] mx-auto flex flex-col items-center justify-center">
        <div class="w-full mb-12 flex flex-col items-center">
          <appLogo variant="white" class="relative w-fit h-6" />
          <div class="w-full mt-6 flex flex-col gap-3 items-center text-center">
            <h2 class="text-white text-3xl font-semibold">
              {{ field.is_sent ? 'Controlla la tua casella di posta elettronica' : 'Modifica la tua password' }}
            </h2>
            <div v-if="!field.is_sent" class="w-full p-4 rounded-xl border flex gap-2 items-start border-[#8e48ff] bg-[#8e48ff]/40 text-white">
              <BadgeInfo class="relative top-0.5 h-5 aspect-square flex-none" />
              <p class="text-sm font-normal text-start">
                Inserisci l'indirizzo email che utilizzi di solito per accedere a Flux. Ti invieremo un'email contenente le istruzioni per creare una
                nuova password.
              </p>
            </div>
          </div>
        </div>
        <form v-if="!field.is_sent" @submit.prevent class="w-full">
          <div class="w-full flex flex-col gap-4">
            <hrInput v-model="field.data.email" :error="field.error.email" type="email" placeholder="Inserisci indirizzo email" />
          </div>
          <hrButton
            size="large"
            variant="core-primary"
            label="Modifica password"
            :loading="field.loading"
            :disabled="!isFormValid"
            class="w-full mt-10"
          />
        </form>
        <div v-else-if="field.is_sent" class="w-full">
          <p class="text-sm font-normal text-center">
            Ti abbiamo inviato una email all'indirizzo <b>{{ field.data.email }}</b
            >. Clicca sul link contenuto nel messaggio per impostare una nuova password.
          </p>
          <p class="mt-4 text-sm font-normal text-center">
            Se non ricevi nessuna email o hai dubbi sull'indirizzo email di accesso scrivi ad <b>assistenza@flux.com</b>
          </p>
          <RouterLink to="/signin">
            <hrButton type="submit" size="large" variant="secondary" label="Accedi" class="w-full mt-10" />
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isValidEmail } from '../../utils/validators';
import { VALIDATION_ERRORS } from '../../utils/constants';

import appLogo from '../../components/global/app-logo.vue';
import hrInput from '../../components/input/hr-input.vue';
import hrButton from '../../components/button/hr-button.vue';

// ICONS
import { BadgeInfo } from '@lucide/vue';

export default {
  name: 'Reset-password',
  components: {
    appLogo,
    hrInput,
    hrButton,

    // ICONS
    BadgeInfo,
  },
  data() {
    return {
      field: {
        data: {
          email: '',
        },
        error: {
          email: null,
        },
        is_sent: false,
        loading: false,
      },
    };
  },
  computed: {
    isFormValid() {
      return isValidEmail(this.field.data.email);
    },
  },
  methods: {
    validateEmail() {
      if (this.field.data.email && !isValidEmail(this.field.data.email)) {
        this.field.error.email = VALIDATION_ERRORS.EMAIL_INVALID;
      } else {
        this.field.error.email = null;
      }
    },
  },
};
</script>

<style scoped>
.blurred-image {
  filter: blur(500px);
}
</style>
