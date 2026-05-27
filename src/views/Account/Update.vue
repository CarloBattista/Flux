<template>
  <navigation />
  <div class="relative w-full flex">
    <div class="w-full min-w-64 max-w-64 h-svh md:block hidden pt-27 p-6 overflow-hidden">
      <div class="w-full h-full flex flex-col">
        <RouterLink to="/profile" class="side-nav">
          <div class="h-full flex items-center justify-center">
            <ChevronLeft size="20" />
          </div>
          <span class="text-sm font-medium">{{ $t('common.goBack') }}</span>
        </RouterLink>
      </div>
    </div>
    <div class="w-full h-svh pt-27 p-6 pb-0">
      <div class="w-full max-w-[768px] mx-auto h-full">
        <div v-if="!authStore.user && !authStore.profile" class="w-full h-full flex items-center justify-center">
          <loader />
        </div>
        <div v-else class="w-full h-full flex flex-col">
          <div class="w-full mb-6 md:hidden flex gap-4 overflow-x-auto">
            <RouterLink to="/profile" class="side-nav min">
              <div class="h-full flex items-center justify-center">
                <ChevronLeft size="20" />
              </div>
              <span class="text-sm font-medium">{{ $t('common.goBack') }}</span>
            </RouterLink>
          </div>
          <div class="w-full sm:max-w-[400px] mx-auto flex flex-col items-center justify-center">
            <div class="w-full mb-12 flex flex-col items-center">
              <appLogo variant="white" class="relative w-fit h-6" />
              <div class="w-full mt-6 flex flex-col gap-3 items-center text-center">
                <h2 class="text-white text-3xl font-semibold">{{ updateTitle }}</h2>
              </div>
            </div>
            <form @submit.prevent="handleSubmit" class="w-full">
              <div v-if="updateType === 'username'" class="w-full flex flex-col gap-4">
                <hrInput v-model="field.data.username" :error="field.error.username" type="text" placeholder="Username" @input="validateUsername" />
              </div>
              <div v-else-if="updateType === 'email'" class="w-full flex flex-col gap-4">
                <hrInput
                  v-model="field.data.currentEmail"
                  :error="field.error.currentEmail"
                  type="email"
                  placeholder="Indrizzo email attuale"
                  :disabled="true"
                />
                <hrInput
                  v-model="field.data.newEmail"
                  :error="field.error.newEmail"
                  type="email"
                  placeholder="Inserisci il tuo nuovo indirizzo email"
                  @input="validateEmail"
                />
              </div>
              <div v-else-if="updateType === 'password'" class="w-full flex flex-col gap-4">
                <hrInput
                  v-model="field.data.password"
                  :error="field.error.password"
                  type="password"
                  placeholder="Nuova password"
                  @input="validatePassword"
                />
                <hrInput
                  v-model="field.data.confirmPassword"
                  :error="field.error.confirmPassword"
                  type="password"
                  placeholder="Conferma nuova password"
                  @input="validateConfirmPassword"
                />
              </div>
              <div v-else-if="updateType === 'phone'" class="w-full flex flex-col gap-4">
                <hrInput v-model="field.data.phone" :error="field.error.phone" type="tel" placeholder="Numero di telefono" @input="validatePhone" />
              </div>
              <div v-else-if="updateType === 'language'" class="w-full flex flex-col gap-4">
                <hrSelect v-model="field.data.language" :options="authStore.languages" :error="field.error.language" />
              </div>
              <hrButton
                type="submit"
                size="large"
                variant="core-primary"
                :label="$t('common.save')"
                :loading="field.loading"
                :disabled="!isFormValid"
                class="w-full mt-10"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authStore } from '../../data/authStore';
import { updateEmail, updatePassword, updatePhone, updateProfile, changeLanguage } from '../../api/auth';
import { isValidEmail, isValidPassword } from '../../utils/validators';
import { VALIDATION_ERRORS } from '../../utils/constants';

import navigation from '../../components/navigation/navigation.vue';
import loader from '../../components/global/loader.vue';
import hrInput from '../../components/input/hr-input.vue';
import hrSelect from '../../components/input/hr-select.vue';
import hrButton from '../../components/button/hr-button.vue';

// ICONS
import { ChevronLeft } from '@lucide/vue';

export default {
  name: 'Update',
  components: {
    navigation,
    loader,
    hrInput,
    hrSelect,
    hrButton,

    // ICONS
    ChevronLeft,
  },
  data() {
    return {
      authStore,

      field: {
        data: {
          username: '',
          currentEmail: '',
          newEmail: '',
          password: '',
          confirmPassword: '',
          language: 'it',
        },
        error: {
          username: null,
          currentEmail: null,
          newEmail: null,
          password: null,
          confirmPassword: null,
          language: null,
        },
        loading: false,
      },
    };
  },
  computed: {
    updateType() {
      const slug = this.$route.params.slug;
      return slug || 'password';
    },
    updateTitle() {
      if (this.updateType === 'username') {
        return 'Cambia il tuo username';
      }
      if (this.updateType === 'password') {
        return 'Cambia la password';
      }
      if (this.updateType === 'phone') {
        return 'Aggiorna numero di telefono';
      }
      if (this.updateType === 'email') {
        return 'Cambia indirizzo email';
      }
      if (this.updateType === 'language') {
        return 'Scegli la tua lingua';
      }
      return 'Aggiorna i tuoi dati';
    },
    isFormValid() {
      if (this.updateType === 'username') {
        return this.field.data.username && this.field.data.username.length >= 3 && this.field.data.username !== authStore.profile?.username;
      }
      if (this.updateType === 'email') {
        return isValidEmail(this.field.data.newEmail);
      }
      if (this.updateType === 'password') {
        return isValidPassword(this.field.data.password) && this.field.data.confirmPassword === this.field.data.password;
      }
      if (this.updateType === 'phone') {
        return this.field.data.phone && this.field.data.phone.length >= 8;
      }
      if (this.updateType === 'language') {
        return !!this.field.data.language;
      }
      return false;
    },
  },
  methods: {
    validateUsername() {
      if (this.field.data.username && this.field.data.username.length < 3) {
        this.field.error.username = 'Lo username deve contenere almeno 3 caratteri';
      } else {
        this.field.error.username = null;
      }
    },
    validateEmail() {
      if (this.field.data.newEmail && !isValidEmail(this.field.data.newEmail)) {
        this.field.error.newEmail = VALIDATION_ERRORS.EMAIL_INVALID;
      } else {
        this.field.error.newEmail = null;
      }
    },
    validatePassword() {
      if (this.field.data.password && !isValidPassword(this.field.data.password)) {
        this.field.error.password = VALIDATION_ERRORS.PASSWORD_TOO_SHORT;
      } else {
        this.field.error.password = null;
      }
      this.validateConfirmPassword();
    },
    validateConfirmPassword() {
      if (this.field.data.confirmPassword && this.field.data.confirmPassword !== this.field.data.password) {
        this.field.error.confirmPassword = VALIDATION_ERRORS.PASSWORD_MISMATCH;
      } else {
        this.field.error.confirmPassword = null;
      }
    },
    validatePhone() {
      if (this.field.data.phone && this.field.data.phone.length < 8) {
        this.field.error.phone = VALIDATION_ERRORS.PHONE_INVALID;
      } else {
        this.field.error.phone = null;
      }
    },

    async handleSubmit() {
      if (!this.isFormValid) return;

      this.field.loading = true;
      let result = { error: null };

      try {
        if (this.updateType === 'username') {
          result = await updateProfile({ username: this.field.data.username });
        } else if (this.updateType === 'email') {
          result = await updateEmail(this.field.data.newEmail);
        } else if (this.updateType === 'password') {
          result = await updatePassword(this.field.data.password);
        } else if (this.updateType === 'phone') {
          result = await updatePhone(this.field.data.phone);
        } else if (this.updateType === 'language') {
          await changeLanguage(this.field.data.language);
          result = { error: null };
        }

        if (result.error) {
          if (this.updateType === 'username' && result.error.code === '23505') {
            this.field.error.username = 'Questo username è già stato preso';
          } else {
            console.error(result.error);
          }
        } else {
          this.$router.push('/profile');
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.field.loading = false;
      }
    },
  },
  mounted() {
    if (this.updateType === 'username' && authStore.profile?.username) {
      this.field.data.username = authStore.profile?.username || '';
    }
    if (this.updateType === 'email' && authStore.user?.email) {
      this.field.data.currentEmail = authStore.user?.email || '';
    }
    if (this.updateType === 'phone' && authStore.user?.phone) {
      this.field.data.phone = authStore.user?.phone || '';
    }
    if (this.updateType === 'language' && authStore.profile?.lang) {
      this.field.data.language = authStore.profile?.lang || 'it';
    }
  },
};
</script>

<style scoped>
.side-nav {
  height: 48px;
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  gap: 8px;
  flex: none;
  align-items: center;
  background-color: transparent;
  transition-property: background-color, color, box-shadow;
  transition-duration: 300ms;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

.side-nav.min {
  height: 36px;
}

.side-nav.router-link-active {
  background-color: rgba(142, 72, 255, 1);
  box-shadow: inset 0 0 4px rgba(255, 255, 255, 0.25);
  color: #fff;
}

.side-nav:not(.router-link-active, .accent):hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.side-nav.accent {
  color: rgba(142, 72, 255, 1);
}

.side-nav.accent:hover {
  background-color: rgba(142, 72, 255, 0.2);
}
</style>
