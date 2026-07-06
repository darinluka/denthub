'use client';

if (typeof window !== 'undefined') {
  const originalGetItem = window.localStorage.getItem;
  const originalSetItem = window.localStorage.setItem;
  const originalRemoveItem = window.localStorage.removeItem;

  // List of keys that must remain globally shared (auth, settings state, registrations)
  const isGlobalKey = (key: string) => {
    return (
      key === 'user_role' ||
      key === 'user_email' ||
      key === 'registration_requests' ||
      key === 'super_admins_list' ||
      key === 'show_wa_on_landing' ||
      key.startsWith('2fa_') ||
      key.startsWith('temp_')
    );
  };

  window.localStorage.getItem = function (key) {
    if (isGlobalKey(key)) {
      return originalGetItem.call(window.localStorage, key);
    }
    const email = originalGetItem.call(window.localStorage, 'user_email');
    if (email) {
      const prefix = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
      return originalGetItem.call(window.localStorage, `${prefix}_${key}`);
    }
    return originalGetItem.call(window.localStorage, key);
  };

  window.localStorage.setItem = function (key, value) {
    if (isGlobalKey(key)) {
      return originalSetItem.call(window.localStorage, key, value);
    }
    const email = originalGetItem.call(window.localStorage, 'user_email');
    if (email) {
      const prefix = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
      return originalSetItem.call(window.localStorage, `${prefix}_${key}`, value);
    }
    return originalSetItem.call(window.localStorage, key, value);
  };

  window.localStorage.removeItem = function (key) {
    if (isGlobalKey(key)) {
      return originalRemoveItem.call(window.localStorage, key);
    }
    const email = originalGetItem.call(window.localStorage, 'user_email');
    if (email) {
      const prefix = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
      return originalRemoveItem.call(window.localStorage, `${prefix}_${key}`);
    }
    return originalRemoveItem.call(window.localStorage, key);
  };
}

export default function TenantProvider() {
  return null;
}
