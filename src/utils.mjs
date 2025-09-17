export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function validateEmail(email) {
  return /.+@.+\..+/.test(String(email || ''));
}

export function deriveDisplayName(email) {
  const s = String(email || '');
  const [name] = s.split('@');
  return name || '';
}

