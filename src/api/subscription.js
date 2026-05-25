import { supabase } from '../services/supabase';
import { authStore } from '../data/authStore';

export async function getSubscription() {
  if (!authStore.profile) return;

  authStore.subscription.loading = true;

  try {
    const { data, error } = await supabase.from('subscriptions').select('*').eq('profile_id', authStore.profile.id);

    if (error) throw error;

    authStore.subscription.data = data || {};
  } catch (e) {
    console.error(e);
    authStore.subscription.error = e.message;
    authStore.subscription.loading = false;
  } finally {
    authStore.subscription.loading = false;
  }
}
