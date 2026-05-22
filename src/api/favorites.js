import { supabase } from '../services/supabase';
import { authStore } from '../data/authStore';

export async function getFavorites() {
  if (!authStore.profile) return;

  try {
    const { data, error } = await supabase.from('favorites').select('*').eq('profile_id', authStore.profile.id);

    if (error) throw error;

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  }
}

export async function getFavoriteBySlug(favoriteSlug) {
  if (!authStore.profile) return;

  try {
    const { data, error } = await supabase.from('favorites').select('*').eq('profile_id', authStore.profile.id).eq('tool_slug', favoriteSlug);

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

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  }
}
