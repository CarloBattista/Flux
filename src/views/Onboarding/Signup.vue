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
            <h2 class="text-white text-3xl font-semibold">Ciaooo, benvenuto!</h2>
            <span class="text-gray-400 text-base font-normal">
              Hai già un account? <RouterLink to="/signin" class="text-white hover:underline">Accedi qui!</RouterLink>
            </span>
          </div>
        </div>
        <form @submit.prevent class="w-full">
          <div class="w-full flex flex-col gap-4">
            <hrInput
              v-if="!field.data.email"
              v-model="field.data.email"
              :error="field.error.email"
              type="email"
              placeholder="Inserisci indirizzo email"
            />
            <hrInput v-model="field.data.password" :error="field.error.password" type="password" placeholder="Crea la tua password" />
            <hrInput
              v-model="field.data.confirmPassword"
              :error="field.error.confirmPassword"
              type="password"
              placeholder="Conferma la tua password"
            />
          </div>
          <hrButton
            @click="actionSignup"
            type="submit"
            size="large"
            variant="core-primary"
            label="Continua"
            :loading="field.loading"
            :disabled="!isFormValid"
            class="w-full mt-10"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '../../services/supabase';
import { authStore } from '../../data/authStore';
import { getProfile } from '../../api/auth';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import { VALIDATION_ERRORS } from '../../utils/constants';

import appLogo from '../../components/global/app-logo.vue';
import hrInput from '../../components/input/hr-input.vue';
import hrButton from '../../components/button/hr-button.vue';

export default {
  name: 'Signup',
  components: {
    appLogo,
    hrInput,
    hrButton,
  },
  data() {
    return {
      field: {
        data: {
          email: '',
          password: '',
          confirmPassword: '',
        },
        error: {
          email: null,
          password: null,
          confirmPassword: null,
        },
        loading: false,
      },
    };
  },
  computed: {
    isFormValid() {
      return isValidEmail(this.field.data.email) && isValidPassword(this.field.data.password);
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

    async actionSignup() {
      if (!this.isFormValid) {
        return;
      }

      this.field.loading = true;

      try {
        const { data, error } = await supabase.auth.signUp({
          email: this.field.data.email,
          password: this.field.data.password,
        });

        if (error) throw error;

        authStore.user = data.user;
        authStore.session = data.session;
        authStore.isAuthenticated = true;
        localStorage.setItem('isAuthenticated', true);

        await getProfile();

        this.$router.push({ name: 'confirm-email' });
      } catch (e) {
        console.error(e);
      } finally {
        this.field.loading = false;
      }
    },
  },
  mounted() {
    if (this.$route.query.email) {
      this.field.data.email = this.$route.query.email;
    }
  },
};
</script>

<style scoped>
.blurred-image {
  filter: blur(500px);
}
</style>
