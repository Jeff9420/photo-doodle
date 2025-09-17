import { validateEmail, deriveDisplayName } from './utils.mjs';

export const AUTH_USERS_KEY = 'photo-doodle-users';
export const AUTH_ACTIVE_KEY = 'photo-doodle-active-user';

export const SOCIAL_PROVIDERS = {
  google: { label: 'Google' },
  apple: { label: 'Apple' },
};

export function loadUsers() {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.map(normalizeUser).filter(Boolean);
  } catch (e) {
    console.warn('loadUsers failed:', e);
    return [];
  }
}

export function saveUsers(users) {
  try {
    const serialized = users.map(serializeUser);
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(serialized));
  } catch (e) {
    console.warn('saveUsers failed:', e);
  }
}

export function normalizeUser(raw) {
  if (!raw || typeof raw.email !== 'string') return null;
  const providers = Array.isArray(raw.providers)
    ? raw.providers.filter((p) => typeof p === 'string')
    : [];
  return {
    email: raw.email.toLowerCase(),
    password: typeof raw.password === 'string' ? raw.password : null,
    providers,
    displayName: typeof raw.displayName === 'string' ? raw.displayName : '',
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : Date.now(),
    lastLoginAt: typeof raw.lastLoginAt === 'number' ? raw.lastLoginAt : null,
  };
}

export function serializeUser(user) {
  return {
    email: user.email,
    password: typeof user.password === 'string' ? user.password : null,
    providers: Array.isArray(user.providers) ? user.providers : [],
    displayName: user.displayName ?? '',
    createdAt: typeof user.createdAt === 'number' ? user.createdAt : Date.now(),
    lastLoginAt: typeof user.lastLoginAt === 'number' ? user.lastLoginAt : Date.now(),
  };
}

export { validateEmail, deriveDisplayName };

