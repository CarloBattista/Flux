import { authStore } from '../data/authStore';

export function canAccessTool(tool) {
  // Accesso libero se non è richiesto il piano Plus
  if (tool?.metadata?.access !== 'plus') {
    return true;
  }

  // Verifica abbonamento attivo per i tool Plus
  return authStore.subscription?.data?.status === 'active';
}
