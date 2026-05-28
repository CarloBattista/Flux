import { supabase } from '../services/supabase';
import { authStore } from '../data/authStore';
import { getSubscription } from './subscription';
import { toast } from '../utils/toast';
import { getFavorites } from './favorites';
import { setLanguage } from '../services/i18n';

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
    const { data, error } = await supabase.from('profiles').select('*, subscriptions(*)').eq('id', userId).maybeSingle();

    if (error) throw error;

    if (!data) {
      await createProfile(userId);
    } else {
      authStore.profile = data;
    }

    await getSubscription();
    await getFavorites();

    if (data?.lang) {
      authStore.currentLanguage = data.lang;
      setLanguage(data.lang);
    }
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

export async function checkHaveProfile(userId) {
  const targetUserId = userId || authStore.user?.id;

  try {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', targetUserId).single();

    if (error) throw error;

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
}

export async function createProfile(userId) {
  const targetUserId = userId || authStore.user?.id;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: targetUserId,
      })
      .select()
      .single();

    if (error) throw error;

    authStore.profile = data;
    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
}

export async function updateEmail(newEmail) {
  if (!authStore.user) return;

  try {
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) throw error;

    authStore.user = data.user;
    toast.light('Email aggiornata con successo!', { showIcon: false, closable: false });
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
    toast.light('Password aggiornata con successo!', { showIcon: false, closable: false });
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
    toast.light('Numero di telefono aggiornato con successo!', { showIcon: false, closable: false });
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

    toast.light('Profilo aggiornato con successo!', { showIcon: false, closable: false });

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
}

export async function checkEmailExists(email) {
  try {
    const { data, error } = await supabase.functions.invoke('check-email', {
      body: { email },
    });

    if (error) throw error;

    return { data, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: e };
  }
}

/**
 * Cambia la lingua dell'applicazione gestendo sia utenti autenticati che guest
 * @param {string} lang - Il codice della lingua ('it', 'en')
 */
export async function changeLanguage(lang) {
  authStore.currentLanguage = lang;
  setLanguage(lang);

  if (authStore.isAuthenticated) {
    try {
      await updateProfile({ lang: lang });
    } catch (e) {
      console.error(e);
    }
  }
}

export async function resendConfirmationEmail(email) {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) throw error;

    toast.light('Email di conferma inviata con successo!', { showIcon: false, closable: false });
    return { error: null };
  } catch (e) {
    console.error(e);
    toast.light('Errore durante invio dell email', { showIcon: false, closable: false });
    return { error: e };
  }
}
