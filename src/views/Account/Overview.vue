<template>
  <navigation />
  <div class="relative w-full flex">
    <div class="w-full min-w-64 max-w-64 h-svh md:block hidden pt-27 p-6 overflow-hidden">
      <div class="w-full h-full flex flex-col">
        <RouterLink to="/profile/overview" class="side-nav">
          <div class="h-full flex items-center justify-center">
            <House size="20" />
          </div>
          <span class="text-sm font-medium">Panoramica</span>
        </RouterLink>
        <RouterLink to="/profile" class="side-nav">
          <div class="h-full flex items-center justify-center">
            <CircleUserRound size="20" />
          </div>
          <span class="text-sm font-medium">Profilo e impostazioni</span>
        </RouterLink>
        <RouterLink to="/profile/subscription" class="side-nav">
          <div class="h-full flex items-center justify-center">
            <CreditCard size="20" />
          </div>
          <span class="text-sm font-medium">Abbonamento</span>
        </RouterLink>
        <a href="#" class="side-nav mt-8 accent">
          <div class="h-full flex items-center justify-center">
            <BadgeQuestionMark size="20" />
          </div>
          <span class="text-sm font-medium">Hai bisogno di aiuto</span>
        </a>
      </div>
    </div>
    <div class="w-full h-svh pt-27 p-6 pb-0">
      <div class="w-full max-w-[768px] mx-auto h-full">
        <div v-if="!authStore.user && !authStore.profile" class="w-full h-full flex items-center justify-center">
          <loader />
        </div>
        <div v-else class="w-full h-full flex flex-col">
          <div class="w-full mb-6 md:hidden flex gap-4 overflow-x-auto">
            <RouterLink to="/profile/overview" class="side-nav min">
              <div class="h-full flex items-center justify-center">
                <House size="20" />
              </div>
              <span class="text-sm font-medium">Panoramica</span>
            </RouterLink>
            <RouterLink to="/profile" class="side-nav min">
              <div class="h-full flex items-center justify-center">
                <CircleUserRound size="20" />
              </div>
              <span class="text-sm font-medium">Profilo e impostazioni</span>
            </RouterLink>
            <RouterLink to="/profile/subscription" class="side-nav min">
              <div class="h-full flex items-center justify-center">
                <CreditCard size="20" />
              </div>
              <span class="text-sm font-medium">Abbonamento</span>
            </RouterLink>
            <a href="#" class="side-nav min accent">
              <div class="h-full flex items-center justify-center">
                <BadgeQuestionMark size="20" />
              </div>
              <span class="text-sm font-medium">Hai bisogno di aiuto</span>
            </a>
          </div>
          <div class="w-full flex flex-col gap-8">
            <div class="w-full flex flex-col gap-4">
              <listContainer>
                <RouterLink to="/profile">
                  <listItem firstLine="Nome utente" :secondLine="authStore.profile?.username || 'Aggiungi nome utente'" />
                </RouterLink>
              </listContainer>
            </div>
            <div class="w-full flex flex-col gap-4">
              <h2 class="text-xl font-medium">I miei abbonamenti</h2>
              <listContainer>
                <div v-if="isSubscribed" class="w-full p-4 flex flex-col gap-2">
                  <h2 class="w-fit px-3 py-1 rounded-lg text-lg font-medium border border-[#8e48ff] bg-[#8e48ff]/40">{{ planLabel }}</h2>
                  <p v-if="authStore.subscription.data?.next_payment_date" class="text-sm font-normal">
                    Data del prossimo pagamento: <span class="font-semibold">{{ authStore.subscription.data?.next_payment_date }}</span>
                  </p>
                  <p v-if="authStore.subscription.data?.cancel_at_period_end" class="text-sm font-normal">
                    L'abbonamento scadrà alla fine del periodo corrente
                  </p>
                  <p v-if="authStore.profile.beta_access" class="text-sm font-normal">Al momento siamo in accesso beta</p>
                </div>
                <RouterLink to="/profile/subscription">
                  <listItem secondLine="Gestisci abbonamento" />
                </RouterLink>
              </listContainer>
            </div>
            <div class="w-full flex flex-col gap-4">
              <h2 class="text-xl font-medium">Collegamenti rapidi</h2>
              <listContainer>
                <listItem v-if="false" icon="CreditCard" secondLine="Controlla cronologia pagamenti" />
                <RouterLink to="/update/password">
                  <listItem icon="LockKeyhole" secondLine="Modifica la password" />
                </RouterLink>
              </listContainer>
              <listContainer>
                <listItem @click="handleLogout" type="destructive" icon="DoorOpen" secondLine="Esci dal tuo account" />
              </listContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { authStore } from '../../data/authStore';
import { logout } from '../../api/auth';
import { isSubscribed } from '../../api/subscription';

import navigation from '../../components/navigation/navigation.vue';
import listContainer from '../../components/list/list-container.vue';
import listItem from '../../components/list/list-item.vue';
import loader from '../../components/global/loader.vue';

// ICONS
import { House, CircleUserRound, CreditCard, BadgeQuestionMark } from '@lucide/vue';

export default {
  name: 'Overview',
  components: {
    navigation,
    listContainer,
    listItem,
    loader,

    // ICONS
    House,
    CircleUserRound,
    CreditCard,
    BadgeQuestionMark,
  },
  data() {
    return {
      authStore,
    };
  },
  computed: {
    isSubscribed() {
      return isSubscribed();
    },
    planLabel() {
      if (!this.authStore.profile) return;

      if (this.authStore.profile.subscription?.plan === 'plus') return 'Plus';

      return 'Free';
    },
  },
  methods: {
    async handleLogout() {
      if (confirm('Seiuro di voler uscire dal tuo account?')) {
        await logout();
      }
    },
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
