import { supabase } from '../services/supabase';
import { authStore } from '../data/authStore';

function clearAuth() {
  authStore.user = null;
  authStore.session = null;
  authStore.profile = null;
  authStore.isAuthenticated = false;
  authStore.userLoading = false;
  authStore.profileLoading = false;
  localStorage.removeItem('isAuthenticated');
}

export async function getAuthUser() {
  authStore.userLoading = true;

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      clearAuth();
      return;
    }

    if (data?.user) {
      authStore.user = data.user;
      authStore.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', true);

      await getSession();
      await getProfile();
    } else {
      clearAuth();
    }
  } catch (e) {
    console.error(e);
    clearAuth();
  } finally {
    authStore.userLoading = false;
  }
}

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) throw error;

    authStore.session = data.session;
  } catch (e) {
    console.error(e);
    clearAuth();
  }
}

export async function getProfile() {
  if (!authStore.user) return;

  const userId = authStore.user.id;

  authStore.profileLoading = true;

  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();

    if (error) throw error;

    authStore.profile = data;
  } catch (e) {
    console.error(e);
  } finally {
    authStore.profileLoading = false;
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    window.location.href = '/signin';

    clearAuth();
  } catch (e) {
    console.error(e);
  }
}

export async function updateEmail(newEmail) {
  if (!authStore.user) return;

  try {
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) throw error;

    authStore.user = data.user;
    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
}

export async function updatePassword(newPassword) {
  if (!authStore.user) return;

  try {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) throw error;

    authStore.user = data.user;
    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
}

export async function updatePhone(newPhone) {
  if (!authStore.user) return;

  try {
    const { data, error } = await supabase.auth.updateUser({ phone: newPhone });

    if (error) throw error;

    authStore.user = data.user;
    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
}

export async function updateProfile(updates) {
  if (!authStore.user) return;

  const userId = authStore.user.id;

  try {
    const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();

    if (error) throw error;

    authStore.profile = data;
    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
}
