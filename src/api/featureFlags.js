import { supabase } from '../services/supabase';
import { store } from '../data/store';

export async function getFeatureFlags() {
  try {
    const { data, error } = await supabase.from('feature_flags').select('key, value, is_active').eq('is_active', true);

    if (error) throw error;

    const flags = (data || []).reduce((acc, flag) => {
      acc[flag.key] = flag;
      return acc;
    }, {});

    store.featureFlags = flags;

    return { data: flags, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
}
