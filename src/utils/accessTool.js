import { authStore } from '../data/authStore';

export function canAccessTool(tool) {
  // Accesso libero se non è richiesto il piano Plus
  if (tool?.metadata?.access !== 'plus') {
    return true;
  }

  // Verifica abbonamento attivo o accesso beta per i tool Plus
  const isSubscribed = authStore.subscription?.data?.status === 'active';
  const isBeta = authStore.profile?.beta_access === true;

  return isSubscribed || isBeta;
}
