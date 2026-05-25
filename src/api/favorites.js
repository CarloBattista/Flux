import { supabase } from '../services/supabase';
import { authStore } from '../data/authStore';
import { store } from '../data/store';
import { toast } from '../utils/toast';

export async function getFavorites() {
  if (!authStore.profile) return;

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('profile_id', authStore.profile.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    store.favorites.data = data || [];
    return { data, error: null };
  } catch (e) {
    console.error(e);
    store.favorites.error = e.message;
    return { data: null, error: e.message };
  }
}

export async function getFavoriteBySlug(favoriteSlug) {
  if (!authStore.profile) return;

  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('profile_id', authStore.profile.id)
      .eq('tool_slug', favoriteSlug)
      .maybeSingle();

    if (error) throw error;

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  }
}

export async function addFavorite(favoriteSlug) {
  if (!authStore.profile) return;

  try {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        profile_id: authStore.profile.id,
        tool_slug: favoriteSlug,
      })
      .select()
      .single();

    if (error) throw error;

    store.favorites.data.push(data);
    toast.light('Aggiunto ai preferiti!', { showIcon: false, closable: false });
    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  }
}

export async function deleteFavorite(favoriteSlug) {
  if (!authStore.profile) return;

  try {
    const { data, error } = await supabase
      .from('favorites')
      .delete()
      .eq('profile_id', authStore.profile.id)
      .eq('tool_slug', favoriteSlug)
      .select()
      .single();

    if (error) throw error;

    store.favorites.data = store.favorites.data.filter((f) => f.tool_slug !== favoriteSlug);
    toast.light('Rimosso dai preferiti!', { showIcon: false, closable: false });
    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  }
}
