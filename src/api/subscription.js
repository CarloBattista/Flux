import { supabase } from '../services/supabase';
import { authStore } from '../data/authStore';

export async function getSubscription() {
  if (!authStore.profile) return;

  authStore.subscription.loading = true;

  try {
    const { data, error } = await supabase.from('subscriptions').select('*').eq('profile_id', authStore.profile.id).maybeSingle();

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

export async function createCheckoutSession(priceId) {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: { priceId },
    });

    if (error) throw error;

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  }
}

export async function cancelSubscription() {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-cancel-subscription');

    if (error) throw error;

    await getSubscription();
    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  }
}

export async function createPortalSession() {
  try {
    const { data, error } = await supabase.functions.invoke('stripe-portal');

    if (error) throw error;

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  }
}

export function isSubscribed() {
  if (!authStore.profile) return;

  return authStore.subscription?.data?.status === 'active';
}
