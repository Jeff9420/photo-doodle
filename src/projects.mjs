export const PROJECT_STORE_KEY = 'photo-doodle-projects';

export function loadProjectStore() {
  try {
    const raw = localStorage.getItem(PROJECT_STORE_KEY);
    if (!raw) return {};
    const data = JSON.parse(raw);
    return data && typeof data === 'object' ? data : {};
  } catch (e) {
    console.warn('loadProjectStore failed:', e);
    return {};
  }
}

export function saveProjectStore(store) {
  try {
    localStorage.setItem(PROJECT_STORE_KEY, JSON.stringify(store));
  } catch (e) {
    console.warn('saveProjectStore failed:', e);
  }
}

export function loadProjectsForUser(email) {
  const store = loadProjectStore();
  const list = store[email?.toLowerCase?.() || ''] || [];
  return Array.isArray(list) ? list.map(normalizeProject).filter(Boolean) : [];
}

export function saveProjectsForUser(email, projects) {
  const key = email?.toLowerCase?.() || '';
  const store = loadProjectStore();
  store[key] = projects.map(serializeProject);
  saveProjectStore(store);
}

export function normalizeProject(raw) {
  if (!raw || typeof raw.id !== 'string') return null;
  return {
    id: raw.id,
    name: typeof raw.name === 'string' ? raw.name : '',
    createdAt: typeof raw.createdAt === 'number' ? raw.createdAt : Date.now(),
    updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : Date.now(),
    photo: typeof raw.photo === 'string' ? raw.photo : null,
    doodle: typeof raw.doodle === 'string' ? raw.doodle : null,
    view: raw.view && typeof raw.view === 'object' ? { ...raw.view } : null,
  };
}

export function serializeProject(project) {
  return {
    id: project.id,
    name: project.name ?? '',
    createdAt: typeof project.createdAt === 'number' ? project.createdAt : Date.now(),
    updatedAt: Date.now(),
    photo: project.photo ?? null,
    doodle: project.doodle ?? null,
    view: project.view ?? null,
  };
}

export function formatProjectTimestamp(ts) {
  try {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate(),
    ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(
      2,
      '0',
    )}`;
  } catch {
    return String(ts ?? '');
  }
}

