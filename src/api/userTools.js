import { supabase } from '../services/supabase';
import { authStore } from '../data/authStore';
import { store } from '../data/store';

export async function handleTool(tool) {
  if (!tool || !authStore.profile) return;

  const profileId = authStore.profile.id;
  const toolSlug = tool.metadata.slug;

  try {
    const { error: recentError } = await supabase.from('recent_tools').upsert(
      {
        profile_id: profileId,
        tool_slug: toolSlug,
        last_used_at: new Date().toISOString(),
      },
      { onConflict: 'profile_id,tool_slug' }
    );

    if (recentError) throw recentError;

    const { error: usageError } = await supabase.from('tool_usage').insert({
      profile_id: profileId,
      tool_slug: toolSlug,
    });

    if (usageError) throw usageError;

    return { error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e.message };
  }
}

export async function getRecentTools(limit = 4) {
  if (!authStore.profile) return;

  store.recentTools.loading = true;

  try {
    const { data, error } = await supabase
      .from('recent_tools')
      .select('*')
      .eq('profile_id', authStore.profile.id)
      .order('last_used_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    store.recentTools.data = data;
    store.recentTools.error = null;
    return { data, error: null };
  } catch (e) {
    console.error(e);
    store.recentTools.error = e;
    return { data: [], error: e };
  } finally {
    store.recentTools.loading = false;
  }
}
