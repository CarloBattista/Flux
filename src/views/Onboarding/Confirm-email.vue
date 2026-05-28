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
            <h2 class="text-white text-3xl font-semibold">{{ $t('onboarding.confirmEmailTitle') }}</h2>
          </div>
        </div>
        <div class="w-full">
          <p class="text-sm font-normal text-center">{{ $t('onboarding.confirmEmailDescription') }}</p>
          <p class="mt-4 text-sm font-normal text-center">{{ $t('onboarding.confirmEmailSent') }}</p>
          <a href="https://mail.google.com/mail/u/0/" target="_blank">
            <hrButton size="large" variant="secondary" :label="$t('onboarding.openEmailButton')" class="w-full mt-10" />
          </a>
          <hrButton
            size="large"
            variant="tertiary"
            :label="resendButtonLabel"
            :disabled="!canResend || resendLoading"
            :loading="resendLoading"
            class="w-full mt-4"
            @click="handleResend"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appLogo from '../../components/global/app-logo.vue';
import hrButton from '../../components/button/hr-button.vue';
import { resendConfirmationEmail } from '../../api/auth';
import { authStore } from '../../data/authStore';

export default {
  name: 'Confirm-email',
  components: {
    appLogo,
    hrButton,
  },
  data() {
    return {
      countdown: 0,
      timer: null,
      resendLoading: false,
    };
  },
  computed: {
    canResend() {
      return this.countdown === 0;
    },
    resendButtonLabel() {
      if (this.countdown > 0) {
        return `Riprova tra ${this.countdown}s`;
      }
      return 'Invia di nuovo email di conferma';
    },
  },
  methods: {
    startCountdown() {
      this.countdown = 60;
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          this.stopCountdown();
        }
      }, 1000);
    },
    stopCountdown() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },

    async handleResend() {
      if (!this.canResend || !authStore.user?.email) return;

      this.resendLoading = true;
      const { error } = await resendConfirmationEmail(authStore.user.email);
      this.resendLoading = false;

      if (!error) {
        this.startCountdown();
      }
    },
  },
  beforeUnmount() {
    this.stopCountdown();
  },
};
</script>

<style scoped>
.blurred-image {
  filter: blur(500px);
}
</style>
