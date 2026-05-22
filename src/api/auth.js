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

    clearAuth();

    window.location.href = '/signin';
  } catch (e) {
    console.error(e);
  }
}
