import { supabase } from '../services/supabase';
import { store } from '../data/store';

export async function getTools() {
  store.tools.loading = true;

  try {
    const { data, error } = await supabase.from('tools').select('*').eq('is_visible', true).order('sort_order');

    if (error) throw error;

    store.tools.data = data;
    return { data, error: null };
  } catch (e) {
    console.error(e);
    store.tools.error = e;
    return { data: null, error: e.message };
  } finally {
    store.tools.loading = false;
  }
}

export async function getToolBySlug(slug) {
  store.tools.loading = true;
  try {
    const { data, error } = await supabase.from('tools').select('*').eq('slug', slug).single();

    if (error) throw error;

    // Aggiorna o aggiunge il tool nel data store locale
    const index = store.tools.data.findIndex((t) => t.slug === slug);
    if (index !== -1) {
      store.tools.data[index] = data;
    } else {
      store.tools.data.push(data);
    }

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  } finally {
    store.tools.loading = false;
  }
}
