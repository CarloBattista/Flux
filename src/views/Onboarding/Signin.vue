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
          to="/"
          type="button"
          class="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white/70 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <span class="text-xs font-bold">{{ $t('common.goHome') }}</span>
        </RouterLink>
      </div>
      <div class="w-full h-full sm:max-w-[400px] mx-auto flex flex-col items-center justify-center">
        <div class="w-full mb-12 flex flex-col items-center">
          <appLogo variant="white" class="relative w-fit h-6" />
          <div class="w-full mt-6 flex flex-col gap-3 items-center text-center">
            <h2 class="text-white text-3xl font-semibold">{{ $t('onboarding.signinTitle') }}</h2>
          </div>
        </div>
        <form @submit.prevent class="w-full">
          <div class="w-full flex flex-col gap-4">
            <hrInput
              v-model="field.data.email"
              type="email"
              :error="field.error.email"
              placeholder="Inserisci indirizzo email"
              :disabled="field.emailExists"
            />
            <hrInput
              v-if="field.emailExists"
              v-model="field.data.password"
              type="password"
              :error="field.error.password"
              placeholder="Inserisci password"
            />
            <div v-if="field.error.general" class="w-full px-2 flex gap-2 items-center">
              <p class="text-red-500 text-sm font-medium">{{ field.error.general }}</p>
            </div>
            <RouterLink v-if="field.emailExists" to="/reset-password" class="text-white text-sm font-medium text-end hover:underline">{{
              $t('onboarding.forgotPassword')
            }}</RouterLink>
          </div>
          <hrButton
            @click="actionSignin"
            type="submit"
            size="large"
            variant="core-primary"
            :label="$t('common.continue')"
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
import { checkEmailExists, getProfile } from '../../api/auth';

import { isValidEmail, isValidPassword } from '../../utils/validators';
import { VALIDATION_ERRORS } from '../../utils/constants';

import appLogo from '../../components/global/app-logo.vue';
import hrInput from '../../components/input/hr-input.vue';
import hrButton from '../../components/button/hr-button.vue';

export default {
  name: 'Signin',
  components: {
    appLogo,
    hrInput,
    hrButton,
  },
  data() {
    return {
      authStore,

      field: {
        data: {
          email: '',
          password: '',
        },
        error: {
          email: null,
          password: null,
          general: null,
        },
        emailExists: false,
        loading: false,
      },
    };
  },
  computed: {
    isFormValid() {
      if (!this.field.emailExists) {
        return isValidEmail(this.field.data.email);
      }
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

    async actionSignin() {
      if (!this.isFormValid) {
        return;
      }

      this.field.loading = true;
      this.field.error.general = null;

      try {
        if (!this.field.emailExists) {
          const { data, error } = await checkEmailExists(this.field.data.email);

          if (error) throw error;

          if (data.exists) {
            this.field.emailExists = true;
          } else {
            this.$router.push({
              name: 'signup',
              query: { email: this.field.data.email },
            });
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: this.field.data.email,
            password: this.field.data.password,
          });

          // if (error) {
          //   if (error.message.includes('Email not confirmed')) {
          //     this.$router.push({ name: 'confirm-email' });
          //     return;
          //   }
          //   throw error;
          // }

          if (error) throw error;

          authStore.user = data.user;
          authStore.session = data.session;
          authStore.isAuthenticated = true;
          localStorage.setItem('isAuthenticated', true);

          await getProfile();

          this.$router.push({ name: 'home' });
        }
      } catch (e) {
        console.error(e);
        this.field.error.general = e.message;
      } finally {
        this.field.loading = false;
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
