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
          to="/reset-password"
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
            <h2 class="text-white text-3xl font-semibold">Crea la nuova password</h2>
          </div>
        </div>
        <form @submit.prevent class="w-full">
          <div class="w-full flex flex-col gap-4">
            <hrInput v-model="field.data.password" :error="field.error.password" type="password" placeholder="Nuova password" />
            <hrInput
              v-model="field.data.confirmPassword"
              :error="field.error.confirmPassword"
              type="password"
              placeholder="Conferma nuova password"
            />
          </div>
          <hrButton size="large" variant="core-primary" label="Continua" :loading="field.loading" :disabled="!isFormValid" class="w-full mt-10" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { isValidPassword } from '../../utils/validators';
import { VALIDATION_ERRORS } from '../../utils/constants';

import appLogo from '../../components/global/app-logo.vue';
import hrInput from '../../components/input/hr-input.vue';
import hrButton from '../../components/button/hr-button.vue';

export default {
  name: 'New-password',
  components: {
    appLogo,
    hrInput,
    hrButton,
  },
  data() {
    return {
      field: {
        data: {
          password: '',
          confirmPassword: '',
        },
        error: {
          password: null,
          confirmPassword: null,
        },
        loading: false,
      },
    };
  },
  computed: {
    isFormValid() {
      return isValidPassword(this.field.data.password);
    },
  },
  methods: {
    validatePassword() {
      if (this.field.data.password && !isValidPassword(this.field.data.password)) {
        this.field.error.password = VALIDATION_ERRORS.PASSWORD_TOO_SHORT;
      } else {
        this.field.error.password = null;
      }
    },
    validateConfirmPassword() {
      if (this.field.data.confirmPassword && this.field.data.confirmPassword !== this.field.data.password) {
        this.field.error.confirmPassword = VALIDATION_ERRORS.PASSWORD_MISMATCH;
      } else {
        this.field.error.confirmPassword = null;
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
