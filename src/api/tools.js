import { supabase } from '../services/supabase';
import { store } from '../data/store';

export async function getTools() {
  try {
    const { data, error } = await supabase.from('tools').select('*').eq('is_visible', true).order('sort_order');

    if (error) throw error;

    store.tools.data = data;
    return { data, error: null };
  } catch (e) {
    console.error(e);
    store.tools.error = e;
    return { data: null, error: e.message };
  }
}

export async function getToolBySlug(slug) {
  try {
    const { data, error } = await supabase.from('tools').select('*').eq('slug', slug).single();

    if (error) throw error;

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  }
}
