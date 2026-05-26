import { authStore } from '../data/authStore';
import { store } from '../data/store';

export function canAccessTool(tool) {
  // Accesso libero se non è richiesto il piano Plus
  if (tool?.metadata?.access !== 'plus') {
    return true;
  }

  // Verifica abbonamento attivo o accesso beta per i tool Plus
  const isSubscribed = authStore.subscription?.data?.status === 'active';
  const isBeta = store.featureFlags?.beta_access === true;

  return isSubscribed || isBeta;
}
