import { supabase } from '../services/supabase';
import { store } from '../data/store';

export async function getPlans() {
  store.plans.loading = true;

  try {
    const { data, error } = await supabase.from('plans').select('*');

    if (error) throw error;

    store.plans.data = data || [];
    return { data, error: null };
  } catch (e) {
    console.error(e);
    store.plans.error = e.message;
    return { data: null, error: e.message };
  } finally {
    store.plans.loading = false;
  }
}
