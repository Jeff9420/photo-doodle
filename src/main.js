import { createUI } from './ui.mjs';
import { STICKER_LIBRARY, createStickers } from './stickers.mjs';
import { AUTH_USERS_KEY, AUTH_ACTIVE_KEY, SOCIAL_PROVIDERS, loadUsers, saveUsers } from './auth.mjs';
import { loadProjectStore, saveProjectStore, loadProjectsForUser, saveProjectsForUser, normalizeProject, serializeProject, formatProjectTimestamp } from './projects.mjs';
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const MAX_HISTORY = 25;
const MAX_PROJECTS = 10;
const DEFAULT_COLOR = '#ff4b6e';
const DEFAULT_SIZE = 12;
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.12;

const FONT_OPTIONS = [
  {
    value: 'noto-sans',
    label: 'Noto Sans SC',
    stack: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    weight: '700',
  },
  {
    value: 'serif-classic',
    label: '缁忓吀瀹嬩綋',
    stack: '"Songti SC", SimSun, serif',
    weight: '700',
  },
  {
    value: 'rounded',
    label: '鍦嗘鼎鏍囬',
    stack: '"Nunito", "Noto Sans SC", sans-serif',
    weight: '700',
  },
  {
    value: 'handwritten',
    label: '娲绘臣鎵嬪啓',
    stack: '"Comic Sans MS", "ZCOOL KuaiLe", cursive',
    weight: '700',
  },
  {
    value: 'calligraphy',
    label: '行书',
    stack: '"KaiTi", "STKaiti", serif',
    weight: '700',
  },
  {
    value: 'display-impact',
    label: '鑺傚簡鏍囬',
    stack: '"Impact", "Arial Black", sans-serif',
    weight: '700',
  },
  {
    value: 'script-soft',
    label: '娴极鑻辨枃瀛椾綋',
    stack: '"Pacifico", "Brush Script MT", cursive',
    weight: '400',
  },
  {
    value: 'neon-bold',
    label: '闇撹櫣椋庢牸',
    stack: '"Montserrat", "Noto Sans SC", sans-serif',
    weight: '800',
  },
  {
    value: 'bubble-fun',
    label: '童趣泡泡',
    stack: '"Baloo 2", "Comic Sans MS", cursive',
    weight: '700',
  },
  {
    value: 'mono-type',
    label: '打字机',
    stack: '"Courier New", monospace',
    weight: '700',
  },
];



const state = {
  mode: 'draw',
  tool: 'starHeart',
  color: DEFAULT_COLOR,
  size: DEFAULT_SIZE,
  isDrawing: false,
  hasPhoto: false,
  lastPoint: null,
  lastStampPoint: null,
  shapeToggle: true,
  pendingText: null,
  selectedStickerId: null,
  stickerCategory: 'birthday',
  stickerSize: 220,
  view: {
    zoom: DEFAULT_ZOOM,
    offsetX: 0,
    offsetY: 0,
  },
  spacePressed: false,
  panMode: false,
  isPanning: false,
  panPointerId: null,
  panLastPoint: null,
  projects: [],
  activeProjectId: null,
};

const authState = {
  mode: 'guest',
  isAuthenticated: true,
  currentUser: { email: 'guest@local', displayName: '访客', providers: [] },
};

const elements = {
  uploadInput: document.getElementById('uploadInput'),
  toolButtons: Array.from(document.querySelectorAll('.tool-button')),
  colorButtons: Array.from(document.querySelectorAll('.color-swatch')),
  sizeButtons: Array.from(document.querySelectorAll('.size-option')),
  undoButton: document.getElementById('undoDoodle'),
  clearButton: document.getElementById('clearDoodle'),
  exportButton: document.getElementById('exportImage'),
  canvasPlaceholder: document.getElementById('canvasPlaceholder'),
  authForm: document.getElementById('authForm'),
  authEmail: document.getElementById('authEmail'),
  authPassword: document.getElementById('authPassword'),
  authSubmit: document.getElementById('authSubmit'),
  authToggle: document.getElementById('authToggle'),
  authMessage: document.getElementById('authMessage'),
  authSuccess: document.getElementById('authSuccess'),
  authWelcome: document.getElementById('authWelcome'),
  authSignOut: document.getElementById('authSignOut'),
  socialButtons: Array.from(document.querySelectorAll('.social-button')),
  socialLogin: document.getElementById('socialLogin'),
  projectName: document.getElementById('projectName'),
  saveProject: document.getElementById('saveProject'),
  newProject: document.getElementById('newProject'),
  projectList: document.getElementById('projectList'),
  placeText: document.getElementById('placeText'),
  textContent: document.getElementById('textContent'),
  fontSelect: document.getElementById('fontSelect'),
  textColor: document.getElementById('textColor'),
  textSize: document.getElementById('textSize'),
  stickerTabs: Array.from(document.querySelectorAll('.sticker-tab')),
  stickerList: document.getElementById('stickerList'),
  stickerSize: document.getElementById('stickerSize'),
  exitStickerMode: document.getElementById('exitStickerMode'),
  canvasWrapper: document.getElementById('canvasWrapper'),
  canvasStage: document.getElementById('canvasStage'),
  zoomIn: document.getElementById('zoomIn'),
  zoomOut: document.getElementById('zoomOut'),
  zoomSlider: document.getElementById('zoomSlider'),
  resetView: document.getElementById('resetView'),
  togglePan: document.getElementById('togglePan'),
};
const stickers = createStickers(elements, state, authState, ensureAuthenticated, cancelTextPlacement, announce);
const { updateStickerCategory, renderStickerList, selectSticker, updateStickerSelection, updateStickerMode, exitStickerMode, getSelectedSticker } = stickers;

const { announce, updatePlaceholder, highlightPlaceholder } = createUI(elements, state);


const photoCanvas = document.getElementById('photoCanvas');
const photoCtx = photoCanvas.getContext('2d');
const doodleCanvas = document.getElementById('doodleCanvas');
const doodleCtx = doodleCanvas.getContext('2d', { willReadFrequently: true });

const doodleHistory = [];
let canvasRect = null;

function init() {
  configureCanvases();
  bindEvents();
  populateFontOptions();
  renderStickerList();
  restoreAuth();
  updateColorSelection(state.color);
  updateSizeSelection(state.size);
  updateToolSelection(state.tool);
  updateStickerCategory();
  updateStickerMode(true);
  updateTextButton();
  updatePlaceholder();
  updatePanStateClasses();
  announce('璇风櫥褰曞悗寮€鍚浉鏈烘垨涓婁紶鐓х墖銆?);
}

function configureCanvases() {
  photoCanvas.width = CANVAS_WIDTH;
  photoCanvas.height = CANVAS_HEIGHT;
  doodleCanvas.width = CANVAS_WIDTH;
  doodleCanvas.height = CANVAS_HEIGHT;
  updateCanvasRect();
  window.addEventListener('resize', () => {
    updateCanvasRect();
  });
  clearCanvas(photoCtx, '#ffffff');
  clearCanvas(doodleCtx);
  applyViewTransform();
  updateViewControls();
}

function bindEvents() {
  elements.uploadInput.addEventListener('change', handleUpload);

  elements.toolButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!ensureAuthenticated()) {
        return;
      }
      setTool(button.dataset.tool);
    });
  });

  elements.colorButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!ensureAuthenticated()) {
        return;
      }
      setColor(button.dataset.color);
    });
  });

  elements.sizeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      if (!ensureAuthenticated()) {
        return;
      }
      setSize(Number(button.dataset.size));
    });
  });

  elements.undoButton.addEventListener('click', () => {
    if (!ensureAuthenticated()) {
      return;
    }
    undoDoodle();
  });

  elements.clearButton.addEventListener('click', () => {
    if (!ensureAuthenticated()) {
      return;
    }
    clearDoodle();
  });

  elements.exportButton.addEventListener('click', () => {
    if (!ensureAuthenticated()) {
      return;
    }
    exportImage();
  });

  elements.placeText.addEventListener('click', prepareTextPlacement);

  elements.stickerTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      if (!ensureAuthenticated()) {
        return;
      }
      state.stickerCategory = tab.dataset.stickerCategory;
      updateStickerCategory();
      renderStickerList();
      exitStickerMode(true);
    });
  });

  elements.stickerSize.addEventListener('input', (event) => {
    state.stickerSize = Number(event.target.value);
  });

  elements.exitStickerMode.addEventListener('click', () => {
    exitStickerMode();
  });

  elements.authForm.addEventListener('submit', handleAuthSubmit);
  elements.authToggle.addEventListener('click', () => {
    toggleAuthMode();
  });
  elements.authSignOut.addEventListener('click', () => {
    signOut();
  });

  elements.socialButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const provider = button.dataset.provider;
      handleSocialSignIn(provider);
    });
  });

  elements.saveProject.addEventListener('click', () => {
    handleSaveProject();
  });
  elements.newProject.addEventListener('click', () => {
    handleNewProject();
  });
  elements.projectList.addEventListener('click', handleProjectListInteraction);

  elements.zoomIn.addEventListener('click', () => {
    if (!ensureAuthenticated()) {
      return;
    }
    adjustZoom(ZOOM_STEP);
  });
  elements.zoomOut.addEventListener('click', () => {
    if (!ensureAuthenticated()) {
      return;
    }
    adjustZoom(-ZOOM_STEP);
  });
  elements.resetView.addEventListener('click', () => {
    if (!ensureAuthenticated()) {
      return;
    }
    resetView(true);
  });
  elements.zoomSlider.addEventListener('input', (event) => {
    if (!ensureAuthenticated()) {
      event.target.value = String(Math.round(state.view.zoom * 100));
      return;
    }
    handleZoomSlider(event);
  });
  elements.togglePan.addEventListener('click', () => {
    if (!ensureAuthenticated()) {
      return;
    }
    togglePanMode();
  });

  elements.canvasWrapper.addEventListener(
    'wheel',
    (event) => {
      if (!authState.isAuthenticated) {
        return;
      }
      handleCanvasWheel(event);
    },
    { passive: false },
  );

  doodleCanvas.addEventListener('pointerdown', startDrawing);
  doodleCanvas.addEventListener('pointermove', continueDrawing);
  doodleCanvas.addEventListener('pointerup', finishDrawing);
  doodleCanvas.addEventListener('pointerleave', finishDrawing);
  doodleCanvas.addEventListener('pointercancel', finishDrawing);

  window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      if (!ensureAuthenticated()) {
        return;
      }
      undoDoodle();
    }
    if (event.key === 'Escape') {
      cancelTextPlacement();
      exitStickerMode(true);
    }
    if (event.code === 'Space') {
      handleSpaceDown(event);
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
      handleSpaceUp(event);
    }
  });
}

function populateFontOptions() {
  elements.fontSelect.innerHTML = '';
  FONT_OPTIONS.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option.value;
    opt.textContent = option.label;
    elements.fontSelect.appendChild(opt);
  });
  elements.fontSelect.value = FONT_OPTIONS[0].value;
}

function restoreAuth() {
  try {
    const activeEmail = localStorage.getItem(AUTH_ACTIVE_KEY);
    const users = loadUsers();
    if (activeEmail) {
      const user = users.find((item) => item.email === activeEmail);
      if (user) {
        authState.isAuthenticated = true;
        authState.currentUser = { ...user };
        state.projects = loadProjectsForUser(user.email);
      }
    }
  } catch (error) {
    console.warn('鏃犳硶鎭㈠鐧诲綍鐘舵€侊細', error);
  }
  updateAuthUI();
  updateViewControls();
}
function handleAuthSubmit(event) {
  event.preventDefault();
  const email = elements.authEmail.value.trim().toLowerCase();
  const password = elements.authPassword.value.trim();
  if (!validateEmail(email)) {
    showAuthMessage('璇疯緭鍏ユ湁鏁堢殑閭鍦板潃銆?);
    elements.authEmail.focus();
    return;
  }
  if (password.length < 6) {
    showAuthMessage('瀵嗙爜鑷冲皯 6 浣嶏紝璇烽噸鏂拌緭鍏ャ€?);
    elements.authPassword.focus();
    return;
  }

  const users = loadUsers();
  const index = users.findIndex((user) => user.email === email);
  const existingUser = index >= 0 ? users[index] : null;

  if (authState.mode === 'login') {
    if (!existingUser) {
      showAuthMessage('鏈壘鍒拌閭锛岃鍏堟敞鍐屾垨浣跨敤绀句氦鐧诲綍銆?);
      return;
    }
    if (!existingUser.password) {
      showAuthMessage('璇ヨ处鍙烽€氳繃绀句氦鏂瑰紡娉ㄥ唽锛岃浣跨敤涓嬫柟绀句氦鐧诲綍鎸夐挳銆?);
      return;
    }
    if (existingUser.password !== password) {
      showAuthMessage('瀵嗙爜涓嶆纭紝璇烽噸璇曘€?);
      return;
    }
    users[index] = { ...existingUser, lastLoginAt: Date.now() };
    saveUsers(users);
    elements.authForm.reset();
    completeLogin(users[index], '鐧诲綍鎴愬姛锛屽紑濮嬪垱浣滃惂锛?, '鐧诲綍鎴愬姛锛岃閫夋嫨鐓х墖鎴栧紑鍚浉鏈恒€?);
    return;
  }

  if (existingUser) {
    showAuthMessage('璇ラ偖绠卞凡娉ㄥ唽锛岃鐩存帴鐧诲綍鎴栦娇鐢ㄧぞ浜ょ櫥褰曘€?);
    return;
  }

  const timestamp = Date.now();
  const newUser = {
    email,
    password,
    providers: [],
    displayName: '',
    createdAt: timestamp,
    lastLoginAt: timestamp,
  };
  users.push(newUser);
  saveUsers(users);
  elements.authForm.reset();
  completeLogin(newUser, '娉ㄥ唽鎴愬姛锛屽凡鑷姩鐧诲綍銆?, '娉ㄥ唽鎴愬姛锛屽揩鏉ユ媿鎽勬垨涓婁紶鐓х墖鍚э紒');
}

function toggleAuthMode() {
  authState.mode = authState.mode === 'login' ? 'register' : 'login';
  updateAuthMode();
  showAuthMessage(
    authState.mode === 'login' ? '娆㈣繋鍥炴潵锛岃鐧诲綍浣撻獙鍏ㄩ儴鍔熻兘銆? : '璁剧疆涓€涓偖绠辫处鍙峰嵆鍙В閿佸垱浣滃姛鑳姐€?,
  );
  elements.authPassword.value = '';
}

function completeLogin(user, message, announcement) {
  authState.isAuthenticated = true;
  authState.currentUser = { ...user };
  localStorage.setItem(AUTH_ACTIVE_KEY, user.email);
  state.projects = loadProjectsForUser(user.email);
  state.activeProjectId = null;
  state.view.zoom = DEFAULT_ZOOM;
  state.view.offsetX = 0;
  state.view.offsetY = 0;
  state.panMode = false;
  state.spacePressed = false;
  state.isPanning = false;
  state.panPointerId = null;
  state.panLastPoint = null;
  if (elements.projectName) {
    elements.projectName.value = '';
  }
  showAuthMessage(message);
  announce(announcement);
  updateAuthUI();
  applyViewTransform();
  updateViewControls();
  updatePanStateClasses();
}

function formatUserWelcome(user) {
  const name = (user.displayName ?? '').trim();
  const providers = Array.isArray(user.providers) ? user.providers : [];
  const providerLabels = providers
    .map((provider) => SOCIAL_PROVIDERS[provider]?.label ?? provider)
    .filter(Boolean)
    .join(' / ');
  if (name) {
    return providerLabels ? `${name}锛?{user.email}锛?路 ${providerLabels}` : `${name}锛?{user.email}锛塦;
  }
  const base = `宸茬櫥褰曪細${user.email}`;
  return providerLabels ? `${base} 路 ${providerLabels}` : base;
}

function updateAuthUI() {
  const authed = authState.isAuthenticated;
  elements.authForm.classList.toggle('is-hidden', authed);
  elements.authSuccess.classList.toggle('is-hidden', !authed);
  if (elements.socialLogin) {
    elements.socialLogin.classList.toggle('is-hidden', authed);
  }
  if (authed && authState.currentUser) {
    elements.authWelcome.textContent = formatUserWelcome(authState.currentUser);
  }
  updateAuthMode();
  elements.uploadInput.disabled = false;
  elements.placeText.disabled = !authed && !state.pendingText;
  elements.stickerSize.disabled = !authed;
  elements.exitStickerMode.disabled = !authed || state.mode !== 'sticker';
  elements.toolButtons.forEach((button) => {
    button.disabled = !authed;
  });
  elements.colorButtons.forEach((button) => {
    button.disabled = !authed;
  });
  elements.sizeButtons.forEach((button) => {
    button.disabled = !authed;
  });
  elements.undoButton.disabled = !authed;
  elements.clearButton.disabled = !authed;
  elements.exportButton.disabled = !authed;
  if (elements.projectName) {
    elements.projectName.disabled = !authed;
  }
  if (elements.saveProject) {
    elements.saveProject.disabled = !authed;
  }
  if (elements.newProject) {
    elements.newProject.disabled = !authed;
  }
  if (elements.zoomIn) {
    elements.zoomIn.disabled = !authed || state.view.zoom >= MAX_ZOOM - 0.001;
  }
  if (elements.zoomOut) {
    elements.zoomOut.disabled = !authed || state.view.zoom <= MIN_ZOOM + 0.001;
  }
  if (elements.zoomSlider) {
    elements.zoomSlider.disabled = !authed;
  }
  if (elements.resetView) {
    elements.resetView.disabled =
      !authed ||
      (Math.abs(state.view.zoom - DEFAULT_ZOOM) < 0.001 &&
        Math.abs(state.view.offsetX) < 0.5 &&
        Math.abs(state.view.offsetY) < 0.5);
  }
  if (elements.togglePan) {
    elements.togglePan.disabled = !authed;
  }
  renderStickerList();
  updateStickerMode(true);
  updateTextButton();
  updateViewControls();
  renderProjectList();
  if (!authed) {
    state.projects = [];
    state.activeProjectId = null;
    if (elements.projectName) {
      elements.projectName.value = '';
    }
    announce('璇风櫥褰曞悗寮€鍚浉鏈烘垨涓婁紶鐓х墖銆?);
  }
}

function updateAuthMode() {
  const isRegister = authState.mode === 'register';
  elements.authSubmit.textContent = isRegister ? '娉ㄥ唽骞剁櫥褰? : '鐧诲綍';
  elements.authToggle.textContent = isRegister ? '鎴戝凡鏈夎处鍙凤紝鍘荤櫥褰? : '鎴戦渶瑕佹敞鍐?;
}

function signOut() {
  authState.isAuthenticated = false;
  authState.currentUser = null;
  localStorage.removeItem(AUTH_ACTIVE_KEY);
  showAuthMessage('宸查€€鍑猴紝璇烽噸鏂扮櫥褰曘€?);
  announce('宸查€€鍑虹櫥褰曪紝浣滃搧宸叉竻绌恒€?);
  state.hasPhoto = false;
  state.projects = [];
  state.activeProjectId = null;
  state.panMode = false;
  state.spacePressed = false;
  state.isPanning = false;
  state.panPointerId = null;
  state.panLastPoint = null;
  state.view.zoom = DEFAULT_ZOOM;
  state.view.offsetX = 0;
  state.view.offsetY = 0;
  clearCanvas(photoCtx, '#ffffff');
  resetDoodleCanvas();
  updatePlaceholder();
  if (elements.projectName) {
    elements.projectName.value = '';
  }
  applyViewTransform();
  updateViewControls();
  updatePanStateClasses();
  updateAuthUI();
}

    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data.map(normalizeUser).filter(Boolean);
    }
  } catch (error) {
    console.warn('璇诲彇鐢ㄦ埛鏁版嵁澶辫触锛?, error);
  }
  return [];
}

}

  const providers = Array.isArray(raw.providers)
    ? raw.providers.filter((provider) => typeof provider === 'string')
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


    const data = JSON.parse(raw);
    if (data && typeof data === 'object') {
      return data;
    }
  } catch (error) {
    console.warn('璇诲彇浣滃搧鏁版嵁澶辫触锛?, error);
  }
  return {};
}

}

  const store = loadProjectStore();
  const raw = Array.isArray(store[email]) ? store[email] : [];
  return raw.map(normalizeProject).filter(Boolean).sort((a, b) => b.updatedAt - a.updatedAt);
}

  const store = loadProjectStore();
  store[email] = projects.map(serializeProject);
  saveProjectStore(store);
}

function saveProjectsForCurrentUser() {
  if (!authState.currentUser) {
    return;
  }
  saveProjectsForUser(authState.currentUser.email, state.projects);
}

  const view = raw.view && typeof raw.view === 'object' ? raw.view : {};
  return {
    id: raw.id,
    name: typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : '鏈懡鍚嶄綔鍝?,
    photo: typeof raw.photo === 'string' ? raw.photo : '',
    doodle: typeof raw.doodle === 'string' ? raw.doodle : '',
    updatedAt: typeof raw.updatedAt === 'number' ? raw.updatedAt : Date.now(),
    view: {
      zoom: typeof view.zoom === 'number' ? clamp(view.zoom, MIN_ZOOM, MAX_ZOOM) : DEFAULT_ZOOM,
      offsetX: typeof view.offsetX === 'number' ? view.offsetX : 0,
      offsetY: typeof view.offsetY === 'number' ? view.offsetY : 0,
    },
  };
}


  const [name] = email.split('@');
  return name || '鍒涗綔鑰?;
}

function handleSaveProject() {
  if (!ensureAuthenticated()) {
    return;
  }
  if (!state.hasPhoto) {
    highlightPlaceholder();
    showAuthMessage('璇峰厛鎷嶆憚鎴栦笂浼犵収鐗囷紝鍐嶄繚瀛樹綔鍝併€?);
    announce('闇€鍏堣浇鍏ョ収鐗囧悗鎵嶈兘淇濆瓨浣滃搧銆?);
    return;
  }
  let projectName = elements.projectName?.value.trim() ?? '';
  if (!projectName) {
    const now = new Date();
    const dateText = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    projectName = `鏈懡鍚嶄綔鍝?${dateText}`;
  }
  let photoData = '';
  let doodleData = '';
  try {
    photoData = photoCanvas.toDataURL('image/png');
    doodleData = doodleCanvas.toDataURL('image/png');
  } catch (error) {
    console.warn('淇濆瓨浣滃搧鏃剁敓鎴愬浘鍍忔暟鎹け璐ワ細', error);
    announce('淇濆瓨澶辫触锛屾祻瑙堝櫒涓嶆敮鎸佸鍑哄綋鍓嶇敾甯冦€?);
    return;
  }
  const project = {
    id: state.activeProjectId ?? `project-${Date.now()}`,
    name: projectName,
    photo: photoData,
    doodle: doodleData,
    updatedAt: Date.now(),
    view: { ...state.view },
  };
  const list = [...state.projects];
  const existingIndex = list.findIndex((item) => item.id === project.id);
  if (existingIndex >= 0) {
    list[existingIndex] = project;
  } else {
    list.unshift(project);
    if (list.length > MAX_PROJECTS) {
      list.length = MAX_PROJECTS;
    }
  }
  state.projects = list.sort((a, b) => b.updatedAt - a.updatedAt);
  state.activeProjectId = project.id;
  saveProjectsForCurrentUser();
  renderProjectList();
  showAuthMessage('浣滃搧宸蹭繚瀛樿嚦鏈湴浣滃搧搴撱€?);
  announce('褰撳墠浣滃搧宸蹭繚瀛橈紝鍙湪鍒楄〃涓噸鏂板姞杞姐€?);
}

function handleNewProject() {
  if (!ensureAuthenticated()) {
    return;
  }
  const shouldConfirm = state.hasPhoto || doodleHistory.length > 0;
  if (shouldConfirm) {
    const proceed = window.confirm('褰撳墠浣滃搧灏氭湭淇濆瓨锛岀‘瀹氳鍒涘缓鏂扮殑绌虹櫧浣滃搧鍚楋紵');
    if (!proceed) {
      return;
    }
  }
  state.activeProjectId = null;
  state.hasPhoto = false;
  clearCanvas(photoCtx, '#ffffff');
  resetDoodleCanvas();
  if (elements.projectName) {
    elements.projectName.value = '';
  }
  resetView();
  updatePlaceholder();
  showAuthMessage('宸插垱寤烘柊鐨勭┖鐧戒綔鍝併€?);
  announce('鏂扮殑绌虹櫧浣滃搧宸插氨缁紝璇峰厛鎷嶆憚鎴栦笂浼犵収鐗囥€?);
}

function handleProjectListInteraction(event) {
  const actionButton = event.target.closest('button[data-project-action]');
  if (!actionButton || !ensureAuthenticated()) {
    return;
  }
  const item = actionButton.closest('.project-item');
  const projectId = item?.dataset.projectId;
  if (!projectId) {
    return;
  }
  if (actionButton.dataset.projectAction === 'load') {
    loadProjectById(projectId);
  } else if (actionButton.dataset.projectAction === 'delete') {
    deleteProject(projectId);
  }
}

function renderProjectList() {
  if (!elements.projectList) {
    return;
  }
  const container = elements.projectList;
  container.innerHTML = '';
  if (!authState.isAuthenticated) {
    const hint = document.createElement('p');
    hint.className = 'hint-text';
    hint.textContent = '鐧诲綍鍚庡彲淇濆瓨浣滃搧锛屽垪琛ㄤ細鍑虹幇鍦ㄨ繖閲屻€?;
    container.appendChild(hint);
    return;
  }
  if (!state.projects.length) {
    const empty = document.createElement('p');
    empty.className = 'hint-text';
    empty.textContent = '鏆傛棤淇濆瓨鐨勪綔鍝侊紝鍒涗綔瀹屾垚鍚庣偣鍑烩€滀繚瀛樿繘搴︹€濄€?;
    container.appendChild(empty);
    return;
  }
  state.projects
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .forEach((project) => {
      const item = document.createElement('div');
      item.className = 'project-item';
      item.dataset.projectId = project.id;
      if (state.activeProjectId === project.id) {
        item.classList.add('active');
      }
      const info = document.createElement('div');
      info.className = 'project-info';
      const name = document.createElement('span');
      name.className = 'project-name';
      name.textContent = project.name;
      const meta = document.createElement('span');
      meta.className = 'project-meta';
      meta.textContent = formatProjectTimestamp(project.updatedAt);
      info.appendChild(name);
      info.appendChild(meta);
      const actions = document.createElement('div');
      actions.className = 'project-actions';
      const loadButton = document.createElement('button');
      loadButton.type = 'button';
      loadButton.className = 'project-action';
      loadButton.dataset.projectAction = 'load';
      loadButton.textContent = '杞藉叆';
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'project-action delete';
      deleteButton.dataset.projectAction = 'delete';
      deleteButton.textContent = '鍒犻櫎';
      actions.appendChild(loadButton);
      actions.appendChild(deleteButton);
      item.appendChild(info);
      item.appendChild(actions);
      container.appendChild(item);
    });
}

function loadProjectById(projectId) {
  const project = state.projects.find((item) => item.id === projectId);
  if (!project) {
    announce('鏈壘鍒板搴旂殑浣滃搧璁板綍銆?);
    return;
  }
  const tasks = [loadImageFromSource(project.photo)];
  if (project.doodle) {
    tasks.push(loadImageFromSource(project.doodle));
  }
  Promise.all(tasks)
    .then((images) => {
      const [photoImage, doodleImage] = images;
      clearCanvas(photoCtx, '#ffffff');
      photoCtx.drawImage(photoImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      clearCanvas(doodleCtx);
      if (doodleImage) {
        doodleCtx.drawImage(doodleImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
      state.hasPhoto = true;
      state.activeProjectId = project.id;
      state.view.zoom = project.view?.zoom ?? DEFAULT_ZOOM;
      state.view.offsetX = project.view?.offsetX ?? 0;
      state.view.offsetY = project.view?.offsetY ?? 0;
      applyViewTransform();
      updateViewControls();
      updatePlaceholder();
      doodleHistory.length = 0;
      pushHistory();
      if (elements.projectName) {
        elements.projectName.value = project.name;
      }
      renderProjectList();
      announce(`宸茶浇鍏ヤ綔鍝侊細${project.name}`);
    })
    .catch((error) => {
      console.warn('杞藉叆浣滃搧澶辫触锛?, error);
      announce('浣滃搧杞藉叆澶辫触锛岃绋嶅悗鍐嶈瘯銆?);
    });
}

function deleteProject(projectId) {
  const index = state.projects.findIndex((item) => item.id === projectId);
  if (index === -1) {
    return;
  }
  const [removed] = state.projects.splice(index, 1);
  saveProjectsForCurrentUser();
  if (state.activeProjectId === projectId) {
    state.activeProjectId = null;
    showAuthMessage('宸插垹闄よ浣滃搧锛屽綋鍓嶇敾闈粛淇濈暀锛屽彲缁х画缂栬緫鎴栧彟瀛樸€?);
  } else {
    showAuthMessage('浣滃搧宸蹭粠鍒楄〃涓Щ闄ゃ€?);
  }
  renderProjectList();
  if (removed && elements.projectName && state.activeProjectId === null) {
    elements.projectName.value = '';
  }
}

  const diff = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) {
    return '鍒氬垰鏇存柊';
  }
  if (diff < hour) {
    const value = Math.max(1, Math.floor(diff / minute));
    return `${value} 鍒嗛挓鍓嶆洿鏂癭;
  }
  if (diff < day) {
    const value = Math.max(1, Math.floor(diff / hour));
    return `${value} 灏忔椂鍓嶆洿鏂癭;
  }
  const date = new Date(timestamp);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} 鏇存柊`;
}

function loadImageFromSource(source) {
  return new Promise((resolve, reject) => {
    if (!source) {
      const placeholder = document.createElement('canvas');
      placeholder.width = CANVAS_WIDTH;
      placeholder.height = CANVAS_HEIGHT;
      resolve(placeholder);
      return;
    }
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = source;
  });
}


function ensureAuthenticated() { if (elements.authMessage && elements.authMessage.textContent) { showAuthMessage(''); } return true; }
    return true;
  }
  showAuthMessage('璇峰厛鐧诲綍浠ヤ娇鐢ㄥ叏閮ㄥ垱浣滃姛鑳姐€?);
  elements.authEmail.focus();
  return false;
}

function showAuthMessage(message) {
  elements.authMessage.textContent = message;
}

function handleSocialSignIn(providerKey) {
  const provider = SOCIAL_PROVIDERS[providerKey];
  if (!provider) {
    showAuthMessage('鏆備笉鏀寔璇ョぞ浜ょ櫥褰曟柟寮忋€?);
    return;
  }
  const emailInput = window.prompt(`浣跨敤 ${provider.label} 鐧诲綍锛岃杈撳叆閭鍦板潃锛歚);
  if (!emailInput) {
    showAuthMessage('宸插彇娑堢ぞ浜ょ櫥褰曘€?);
    return;
  }
  const email = emailInput.trim().toLowerCase();
  if (!validateEmail(email)) {
    showAuthMessage('璇疯緭鍏ユ湁鏁堢殑閭鍦板潃銆?);
    return;
  }
  let displayNameInput = window.prompt('鍙€夛細杈撳叆涓€涓垱浣滄椂鏄剧ず鐨勬樀绉帮紙鐣欑┖鍒欎娇鐢ㄩ偖绠卞墠缂€锛?);
  if (displayNameInput === null) {
    displayNameInput = '';
  }
  const displayName = displayNameInput.trim();
  const users = loadUsers();
  const index = users.findIndex((user) => user.email === email);
  const timestamp = Date.now();
  if (index >= 0) {
    const user = users[index];
    const providers = new Set(user.providers ?? []);
    providers.add(providerKey);
    const name = displayName || user.displayName || deriveDisplayName(email);
    const updatedUser = {
      ...user,
      providers: Array.from(providers),
      displayName: name,
      lastLoginAt: timestamp,
    };
    users[index] = updatedUser;
    saveUsers(users);
    completeLogin(
      updatedUser,
      `${provider.label} 鐧诲綍鎴愬姛锛屽紑濮嬪垱浣滃惂锛乣,
      `${provider.label} 鐧诲綍鎴愬姛锛屽彲缁х画鍒涗綔銆俙,
    );
    return;
  }

  const newUser = {
    email,
    password: null,
    providers: [providerKey],
    displayName: displayName || deriveDisplayName(email),
    createdAt: timestamp,
    lastLoginAt: timestamp,
  };
  users.push(newUser);
  saveUsers(users);
  completeLogin(
    newUser,
    `${provider.label} 鐧诲綍鎴愬姛锛屾杩庡姞鍏ワ紒`,
    `${provider.label} 鐧诲綍鎴愬姛锛屽彲缁х画鍒涗綔銆俙,
  );
}




  ,
        height: { ideal: 1080 },
      },
      audio: false,
    });
    elements.video.srcObject = stream;
    await playVideo(elements.video);
    
    announce('鎽勫儚澶村凡寮€鍚紝鍙互鐐瑰嚮鈥滄媿鎽勭収鐗団€濇崟鎹夌敾闈€?);
  } catch (error) {
    const message = error?.name === 'NotAllowedError'
      ? '璁块棶鎽勫儚澶磋鎷掔粷锛岃妫€鏌ユ祻瑙堝櫒鏉冮檺璁剧疆銆?
      : `鏃犳硶璁块棶鎽勫儚澶达細${error?.message ?? '鏈煡閿欒'}`;
    announce(message);
    throw error;
  } finally {
  }
}

function disableCameraControls() {
  elements.stopCamera.disabled = true;
}

  if (elements.video.srcObject) {
    elements.video.srcObject = null;
  }
  announce('宸插叧闂憚鍍忓ご锛屽闇€閲嶆柊鎷嶆憚璇风偣鍑烩€滃紑鍚浉鏈衡€濄€?);
}

  });
}

  drawSourceToPhoto(elements.video, elements.video.videoWidth, elements.video.videoHeight);
  resetDoodleCanvas();
  announce('宸叉崟鎹夊綋鍓嶇敾闈紝蹇潵缁樺埗浣犵殑绁濈鍚э紒');
}

function handleUpload(event) {
  const [file] = event.target.files;
  if (!ensureAuthenticated()) {
    event.target.value = '';
    return;
  }
  if (!file) {
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    announce('鍥剧墖瓒呰繃 10 MB 闄愬埗锛岃閫夋嫨鏇村皬鐨勬枃浠躲€?);
    event.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    const image = new Image();
    image.onload = () => {
      drawSourceToPhoto(image, image.width, image.height);
      resetDoodleCanvas();
      announce('鍥剧墖宸茶浇鍏ワ紝鍙互缁х画鍒涗綔銆?);
    };
    image.onerror = () => {
      announce('鍥剧墖鍔犺浇澶辫触锛岃灏濊瘯鍏朵粬鏂囦欢鎴栫◢鍚庡啀璇曘€?);
    };
    image.src = String(loadEvent.target?.result);
  };
  reader.onerror = () => {
    announce('璇诲彇鍥剧墖鏂囦欢鏃跺彂鐢熼敊璇紝璇烽噸鏂伴€夋嫨鏂囦欢銆?);
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function drawSourceToPhoto(source, sourceWidth, sourceHeight) {
  clearCanvas(photoCtx, '#ffffff');
  const scale = Math.min(CANVAS_WIDTH / sourceWidth, CANVAS_HEIGHT / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  const dx = (CANVAS_WIDTH - drawWidth) / 2;
  const dy = (CANVAS_HEIGHT - drawHeight) / 2;

  photoCtx.save();
  photoCtx.shadowColor = 'rgba(0, 0, 0, 0.12)';
  photoCtx.shadowBlur = 24;
  photoCtx.drawImage(source, dx, dy, drawWidth, drawHeight);
  photoCtx.restore();

  state.hasPhoto = true;
  updatePlaceholder();
}
function setTool(tool) {
  state.tool = tool;
  state.mode = 'draw';
  cancelTextPlacement();
  updateToolSelection(tool);
  if (tool !== 'starHeart') {
    exitStickerMode(true);
  }
}

function setColor(color) {
  state.color = color;
  updateColorSelection(color);
}

function setSize(size) {
  state.size = size;
  updateSizeSelection(size);
}

function updateToolSelection(tool) {
  elements.toolButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.tool === tool);
  });
}

function updateColorSelection(color) {
  elements.colorButtons.forEach((button) => {
    const isActive = button.dataset.color === color;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function updateSizeSelection(size) {
  elements.sizeButtons.forEach((button) => {
    const isActive = Number(button.dataset.size) === size;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

  list.forEach((sticker) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sticker-button';
    button.dataset.stickerId = sticker.id;
    button.innerHTML = `
      <span class="sticker-glyph">${sticker.preview}</span>
      <span>${sticker.label}</span>
    `;
    button.disabled = !authState.isAuthenticated;
    button.addEventListener('click', () => {
      if (!ensureAuthenticated()) {
        return;
      }
      selectSticker(sticker.id);
    });
    container.appendChild(button);
  });
  updateStickerSelection();
}

}

  state.mode = 'draw';
  state.selectedStickerId = null;
  updateStickerSelection();
  updateStickerMode(silent);
}

function updateTextButton() {
  if (!state.pendingText) {
    elements.placeText.textContent = '鐐瑰嚮鐢诲竷鏀剧疆';
    elements.placeText.disabled = !authState.isAuthenticated;
  }
}

function prepareTextPlacement() {
  if (!ensureAuthenticated()) {
    return;
  }
  if (!state.hasPhoto) {
    highlightPlaceholder();
    announce('璇峰厛鎷嶆憚鎴栦笂浼犱竴寮犵収鐗囥€?);
    return;
  }
  const text = elements.textContent.value.trim();
  if (!text) {
    announce('璇疯緭鍏ユ兂瑕佹斁缃殑鏂囨湰鍐呭銆?);
    elements.textContent.focus();
    return;
  }
  const fontOption = FONT_OPTIONS.find((option) => option.value === elements.fontSelect.value) ?? FONT_OPTIONS[0];
  const color = elements.textColor.value || '#1b1b2f';
  const size = Number(elements.textSize.value) || 64;
  state.pendingText = {
    text,
    font: fontOption.stack,
    weight: fontOption.weight,
    color,
    size,
  };
  state.mode = 'text';
  state.selectedStickerId = null;
  updateStickerSelection();
  updateStickerMode(true);
  elements.placeText.textContent = '鍦ㄧ敾甯冪偣鍑绘斁缃€?;
  elements.placeText.disabled = true;
  announce('鏂囨湰鏀剧疆妯″紡宸插紑鍚紝璇峰湪鐢诲竷涓婄偣鍑讳綅缃€?);
}

function cancelTextPlacement() {
  if (state.pendingText || state.mode === 'text') {
    state.pendingText = null;
    if (state.mode === 'text') {
      state.mode = 'draw';
    }
    updateTextButton();
  }
}

function startDrawing(event) {
  if (!authState.isAuthenticated) {
    showAuthMessage('璇峰厛鐧诲綍浠ヨ繘琛屾秱楦︺€佹枃鏈垨璐寸焊鎿嶄綔銆?);
    elements.authEmail.focus();
    return;
  }
  if (maybeBeginPan(event)) {
    return;
  }
  if (!state.hasPhoto) {
    highlightPlaceholder();
    announce('璇峰厛鎷嶆憚鎴栦笂浼犱竴寮犵収鐗囥€?);
    return;
  }
  if (event.isPrimary === false && event.pointerType !== 'mouse') {
    return;
  }
  event.preventDefault();
  const point = getCanvasCoordinates(event);

  if (state.mode === 'text' && state.pendingText) {
    pushHistory();
    placeText(point);
    return;
  }
  if (state.mode === 'sticker' && state.selectedStickerId) {
    pushHistory();
    placeSticker(point);
    return;
  }

  state.mode = 'draw';
  state.isDrawing = true;
  state.shapeToggle = true;
  state.lastPoint = point;
  state.lastStampPoint = { ...point };
  pushHistory();
  try {
    doodleCanvas.setPointerCapture(event.pointerId);
  } catch (error) {
    /* 鏌愪簺娴忚鍣ㄥ湪澶氭寚瑙︽帶鏃跺彲鑳戒笉鏀寔 Pointer Capture锛屽彲蹇界暐 */
  }

  if (state.tool === 'starHeart') {
    stampStarHeart(point, true);
  } else if (state.tool === 'brush') {
    drawStrokeSegment(point, point, { color: state.color, width: state.size });
  } else if (state.tool === 'marker') {
    drawMarkerSegment(point, point, { color: state.color, width: state.size * 1.6 });
  } else if (state.tool === 'highlighter') {
    drawHighlighterSegment(point, point, { color: state.color, width: state.size * 2.3 });
  } else if (state.tool === 'eraser') {
    drawStrokeSegment(point, point, { erase: true, width: state.size });
  }
}

function continueDrawing(event) {
  if (state.isPanning && state.panPointerId === event.pointerId) {
    updatePan(event);
    return;
  }
  if (!state.isDrawing || state.mode !== 'draw') {
    return;
  }
  if (event.isPrimary === false && event.pointerType !== 'mouse') {
    return;
  }
  event.preventDefault();
  const point = getCanvasCoordinates(event);

  if (state.tool === 'starHeart') {
    const spacing = state.size * 1.4;
    let lastPoint = { ...state.lastStampPoint };
    let remainingDistance = getDistance(lastPoint, point);
    if (remainingDistance >= spacing) {
      const angle = Math.atan2(point.y - lastPoint.y, point.x - lastPoint.x);
      while (remainingDistance >= spacing) {
        lastPoint = {
          x: lastPoint.x + Math.cos(angle) * spacing,
          y: lastPoint.y + Math.sin(angle) * spacing,
        };
        stampStarHeart(lastPoint);
        remainingDistance = getDistance(lastPoint, point);
      }
      state.lastStampPoint = lastPoint;
    }
  } else if (state.tool === 'brush') {
    drawStrokeSegment(state.lastPoint, point, { color: state.color, width: state.size });
    state.lastPoint = point;
  } else if (state.tool === 'marker') {
    drawMarkerSegment(state.lastPoint, point, { color: state.color, width: state.size * 1.6 });
    state.lastPoint = point;
  } else if (state.tool === 'highlighter') {
    drawHighlighterSegment(state.lastPoint, point, { color: state.color, width: state.size * 2.3 });
    state.lastPoint = point;
  } else if (state.tool === 'eraser') {
    drawStrokeSegment(state.lastPoint, point, { erase: true, width: state.size });
    state.lastPoint = point;
  }
}

function finishDrawing(event) {
  if (state.isPanning && state.panPointerId === event.pointerId) {
    endPan(event);
    return;
  }
  if (!state.isDrawing) {
    return;
  }
  event.preventDefault();
  state.isDrawing = false;
  state.lastPoint = null;
  state.lastStampPoint = null;
  try {
    doodleCanvas.releasePointerCapture(event.pointerId);
  } catch (error) {
    /* 蹇界暐 Pointer Capture 閲婃斁寮傚父 */
  }
}

function drawStrokeSegment(from, to, options) {
  const { color = '#000000', width = DEFAULT_SIZE, erase = false } = options;
  doodleCtx.save();
  doodleCtx.lineCap = 'round';
  doodleCtx.lineJoin = 'round';
  doodleCtx.lineWidth = width;
  doodleCtx.strokeStyle = erase ? 'rgba(0,0,0,1)' : color;
  doodleCtx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';
  doodleCtx.beginPath();
  doodleCtx.moveTo(from.x, from.y);
  doodleCtx.lineTo(to.x, to.y);
  doodleCtx.stroke();
  doodleCtx.restore();
}

function drawMarkerSegment(from, to, options) {
  const { color = DEFAULT_COLOR, width = DEFAULT_SIZE * 1.6 } = options;
  doodleCtx.save();
  doodleCtx.lineCap = 'round';
  doodleCtx.lineJoin = 'round';
  doodleCtx.globalCompositeOperation = 'source-over';
  doodleCtx.strokeStyle = hexToRgba(color, 0.85);
  doodleCtx.lineWidth = width;
  doodleCtx.shadowColor = hexToRgba(color, 0.35);
  doodleCtx.shadowBlur = width * 0.45;
  doodleCtx.beginPath();
  doodleCtx.moveTo(from.x, from.y);
  doodleCtx.lineTo(to.x, to.y);
  doodleCtx.stroke();
  doodleCtx.lineWidth = width * 0.55;
  doodleCtx.strokeStyle = hexToRgba(color, 0.45);
  doodleCtx.shadowBlur = width * 0.2;
  doodleCtx.stroke();
  doodleCtx.restore();
}

function drawHighlighterSegment(from, to, options) {
  const { color = '#ffff66', width = DEFAULT_SIZE * 2.3 } = options;
  doodleCtx.save();
  doodleCtx.lineCap = 'round';
  doodleCtx.lineJoin = 'round';
  doodleCtx.globalCompositeOperation = 'multiply';
  doodleCtx.strokeStyle = hexToRgba(color, 0.32);
  doodleCtx.lineWidth = width;
  doodleCtx.beginPath();
  doodleCtx.moveTo(from.x, from.y);
  doodleCtx.lineTo(to.x, to.y);
  doodleCtx.stroke();
  doodleCtx.restore();
}

function placeText(point) {
  if (!state.pendingText) {
    return;
  }
  drawTextBlock(point.x, point.y, state.pendingText);
  state.pendingText = null;
  state.mode = 'draw';
  updateTextButton();
  announce('鏂囨湰宸叉斁缃湪鐢诲竷涓娿€?);
}

function placeSticker(point) {
  const sticker = getSelectedSticker();
  if (!sticker) {
    return;
  }
  drawSticker(point.x, point.y, sticker, state.stickerSize);
  announce('璐寸焊宸叉斁缃紝鍙户缁偣鍑绘坊鍔犳洿澶氥€?);
}

function drawTextBlock(x, y, options) {
  const lines = options.text.split(/\n/).map((line) => line.trim()).filter((line) => line.length > 0);
  const fontSize = options.size;
  const lineHeight = fontSize * 1.35;
  const paddingX = fontSize * 0.6;
  const paddingY = fontSize * 0.6;

  doodleCtx.save();
  doodleCtx.font = `${options.weight} ${fontSize}px ${options.font}`;
  doodleCtx.textAlign = 'center';
  doodleCtx.textBaseline = 'middle';

  let maxWidth = 0;
  if (!lines.length) {
    lines.push(options.text);
  }
  lines.forEach((line) => {
    const metrics = doodleCtx.measureText(line);
    maxWidth = Math.max(maxWidth, metrics.width);
  });

  const rectWidth = maxWidth + paddingX * 2;
  const rectHeight = lineHeight * lines.length + paddingY * 2;
  const radius = Math.min(fontSize * 0.6, 48);

  drawRoundedRect(
    doodleCtx,
    x - rectWidth / 2,
    y - rectHeight / 2,
    rectWidth,
    rectHeight,
    radius,
    'rgba(255, 255, 255, 0.88)',
    'rgba(0, 0, 0, 0.08)',
  );

  doodleCtx.fillStyle = options.color;
  doodleCtx.shadowColor = hexToRgba(options.color, 0.35);
  doodleCtx.shadowBlur = fontSize * 0.45;

  lines.forEach((line, index) => {
    const lineY = y - rectHeight / 2 + paddingY + lineHeight * index + lineHeight / 2;
    doodleCtx.fillText(line, x, lineY);
  });
  doodleCtx.restore();
}

function drawSticker(x, y, sticker, size) {
  const fontSize = size * sticker.fontScale;
  const lineHeight = fontSize * 1.25;
  const paddingX = size * 0.3;
  const paddingY = size * 0.25;
  const lines = sticker.text.split(/\n/);

  doodleCtx.save();
  doodleCtx.translate(x, y);
  doodleCtx.font = `${sticker.fontWeight} ${fontSize}px ${sticker.fontFamily}`;
  doodleCtx.textAlign = 'center';
  doodleCtx.textBaseline = 'middle';

  let maxWidth = 0;
  lines.forEach((line) => {
    const metrics = doodleCtx.measureText(line);
    maxWidth = Math.max(maxWidth, metrics.width);
  });

  const rectWidth = Math.max(size * 0.9, maxWidth + paddingX * 2);
  const rectHeight = lineHeight * lines.length + paddingY * 2;
  const radius = Math.min(size * 0.25, 60);

  drawRoundedRect(
    doodleCtx,
    -rectWidth / 2,
    -rectHeight / 2,
    rectWidth,
    rectHeight,
    radius,
    sticker.bg,
    sticker.border,
  );

  doodleCtx.fillStyle = sticker.fg;
  doodleCtx.shadowColor = hexToRgba(sticker.fg, 0.35);
  doodleCtx.shadowBlur = size * 0.25;

  lines.forEach((line, index) => {
    const lineY = -rectHeight / 2 + paddingY + lineHeight * index + lineHeight / 2;
    doodleCtx.fillText(line, 0, lineY);
  });
  doodleCtx.restore();
}

function drawRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.restore();
}

function undoDoodle() {
  if (!doodleHistory.length) {
    announce('娌℃湁鍙挙閿€鐨勭瑪鐢汇€?);
    return;
  }
  const snapshot = doodleHistory.pop();
  doodleCtx.putImageData(snapshot, 0, 0);
  announce('宸叉挙閿€涓婁竴绗旀搷浣溿€?);
}

function clearDoodle() {
  if (!state.hasPhoto && doodleHistory.length === 0) {
    return;
  }
  pushHistory();
  clearCanvas(doodleCtx);
  cancelTextPlacement();
  exitStickerMode(true);
  announce('鐢诲竷宸叉竻绌猴紝鍙互閲嶆柊寮€濮嬪垱浣溿€?);
}

function resetDoodleCanvas() {
  doodleHistory.length = 0;
  clearCanvas(doodleCtx);
  cancelTextPlacement();
  exitStickerMode(true);
}

function exportImage() {
  if (!state.hasPhoto) {
    announce('璇峰厛鎷嶆憚鎴栦笂浼犱竴寮犵収鐗囷紝鍐嶅鍑轰綔鍝併€?);
    highlightPlaceholder();
    return;
  }
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = CANVAS_WIDTH;
  exportCanvas.height = CANVAS_HEIGHT;
  const exportCtx = exportCanvas.getContext('2d');
  exportCtx.drawImage(photoCanvas, 0, 0);
  exportCtx.drawImage(doodleCanvas, 0, 0);
  const url = exportCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = url;
  link.download = `photo-doodle-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  announce('PNG 鏂囦欢宸茬敓鎴愶紝鍙洿鎺ヤ繚瀛樻垨鍒嗕韩銆?);
}

function pushHistory() {
  try {
    const snapshot = doodleCtx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    doodleHistory.push(snapshot);
    if (doodleHistory.length > MAX_HISTORY) {
      doodleHistory.shift();
    }
  } catch (error) {
    console.warn('鏃犳硶璁板綍鎾ら攢鍘嗗彶锛?, error);
  }
}

function clearCanvas(ctx, fillStyle) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
  ctx.restore();
}

function updateCanvasRect() {
  canvasRect = doodleCanvas.getBoundingClientRect();
}

function applyViewTransform() {
  if (!elements.canvasStage) {
    return;
  }
  elements.canvasStage.style.setProperty('--zoom', state.view.zoom.toFixed(3));
  elements.canvasStage.style.setProperty('--pan-x', `${state.view.offsetX}px`);
  elements.canvasStage.style.setProperty('--pan-y', `${state.view.offsetY}px`);
  updateCanvasRect();
}

function updateViewControls() {
  const zoomPercent = Math.round(state.view.zoom * 100);
  if (elements.zoomSlider && Number(elements.zoomSlider.value) !== zoomPercent) {
    elements.zoomSlider.value = String(zoomPercent);
  }
  if (elements.zoomIn) {
    elements.zoomIn.disabled = !authState.isAuthenticated || state.view.zoom >= MAX_ZOOM - 0.001;
  }
  if (elements.zoomOut) {
    elements.zoomOut.disabled = !authState.isAuthenticated || state.view.zoom <= MIN_ZOOM + 0.001;
  }
  if (elements.resetView) {
    elements.resetView.disabled =
      !authState.isAuthenticated ||
      (Math.abs(state.view.zoom - DEFAULT_ZOOM) < 0.001 &&
        Math.abs(state.view.offsetX) < 0.5 &&
        Math.abs(state.view.offsetY) < 0.5);
  }
  if (elements.togglePan) {
    elements.togglePan.setAttribute('aria-pressed', String(state.panMode));
  }
  updatePanStateClasses();
}

function togglePanMode() {
  state.panMode = !state.panMode;
  if (!state.panMode && state.isPanning) {
    state.isPanning = false;
    state.panPointerId = null;
    state.panLastPoint = null;
  }
  updatePanStateClasses();
}

function updatePanStateClasses() {
  if (!elements.canvasWrapper) {
    return;
  }
  const enabled = authState.isAuthenticated && (state.panMode || state.spacePressed);
  elements.canvasWrapper.classList.toggle('pan-enabled', enabled);
  elements.canvasWrapper.classList.toggle('pan-active', state.isPanning);
  if (elements.togglePan) {
    elements.togglePan.setAttribute('aria-pressed', String(state.panMode));
  }
}

function handleZoomSlider(event) {
  const value = Number(event.target.value);
  if (Number.isNaN(value)) {
    return;
  }
  const ratio = clamp(value / 100, MIN_ZOOM, MAX_ZOOM);
  setZoom(ratio);
}

function setZoom(zoom, focusPoint) {
  const nextZoom = clamp(zoom, MIN_ZOOM, MAX_ZOOM);
  const previousZoom = state.view.zoom;
  if (Math.abs(nextZoom - previousZoom) < 0.0001) {
    updateViewControls();
    return;
  }
  if (focusPoint) {
    adjustPanForZoom(focusPoint, previousZoom, nextZoom);
  }
  state.view.zoom = nextZoom;
  applyViewTransform();
  updateViewControls();
}

function adjustZoom(delta, focusPoint) {
  setZoom(state.view.zoom + delta, focusPoint);
}

function resetView(announceReset = false) {
  state.view.zoom = DEFAULT_ZOOM;
  state.view.offsetX = 0;
  state.view.offsetY = 0;
  applyViewTransform();
  updateViewControls();
  if (announceReset) {
    announce('鐢诲竷瑙嗗浘宸查噸缃€?);
  }
}

function adjustPanForZoom(focusPoint, oldZoom, newZoom) {
  const rect = doodleCanvas.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const relativeX = focusPoint.x - (centerX + state.view.offsetX);
  const relativeY = focusPoint.y - (centerY + state.view.offsetY);
  const ratio = newZoom / oldZoom;
  state.view.offsetX += relativeX - relativeX * ratio;
  state.view.offsetY += relativeY - relativeY * ratio;
}

function handleCanvasWheel(event) {
  if (!state.hasPhoto) {
    return;
  }
  event.preventDefault();
  const focusPoint = { x: event.clientX, y: event.clientY };
  const direction = event.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
  const modifier = event.ctrlKey ? 1.5 : 1;
  adjustZoom(direction * modifier, focusPoint);
}

function shouldStartPan(event) {
  if (!authState.isAuthenticated) {
    return false;
  }
  if (state.panMode || state.spacePressed) {
    return true;
  }
  return event.pointerType === 'mouse' && event.button === 1;
}

function maybeBeginPan(event) {
  if (!shouldStartPan(event)) {
    return false;
  }
  event.preventDefault();
  state.isPanning = true;
  state.panPointerId = event.pointerId;
  state.panLastPoint = { x: event.clientX, y: event.clientY };
  updatePanStateClasses();
  try {
    doodleCanvas.setPointerCapture(event.pointerId);
  } catch (error) {
    /* 鏌愪簺娴忚鍣ㄥ湪澶氭寚鎿嶄綔鏃跺彲鑳戒笉鏀寔 Pointer Capture锛屽彲蹇界暐 */
  }
  return true;
}

function updatePan(event) {
  if (!state.isPanning || state.panPointerId !== event.pointerId) {
    return;
  }
  event.preventDefault();
  if (state.panLastPoint) {
    state.view.offsetX += event.clientX - state.panLastPoint.x;
    state.view.offsetY += event.clientY - state.panLastPoint.y;
  }
  state.panLastPoint = { x: event.clientX, y: event.clientY };
  applyViewTransform();
  updateViewControls();
}

function endPan(event) {
  if (!state.isPanning || state.panPointerId !== event.pointerId) {
    return;
  }
  event.preventDefault();
  state.isPanning = false;
  state.panPointerId = null;
  state.panLastPoint = null;
  updatePanStateClasses();
  try {
    doodleCanvas.releasePointerCapture(event.pointerId);
  } catch (error) {
    /* 蹇界暐 Pointer Capture 閲婃斁澶辫触 */
  }
}

function handleSpaceDown(event) {
  if (event.repeat || isTextInput(event.target)) {
    return;
  }
  event.preventDefault();
  state.spacePressed = true;
  updatePanStateClasses();
}

function handleSpaceUp(event) {
  if (isTextInput(event.target)) {
    return;
  }
  state.spacePressed = false;
  if (!state.panMode) {
    state.isPanning = false;
    state.panPointerId = null;
    state.panLastPoint = null;
  }
  updatePanStateClasses();
}

function isTextInput(element) {
  if (!element) {
    return false;
  }
  const tag = element.tagName ? element.tagName.toLowerCase() : '';
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    Boolean(element.isContentEditable)
  );
}

function getCanvasCoordinates(event) {
  if (!canvasRect) {
    canvasRect = doodleCanvas.getBoundingClientRect();
  }
  const x = ((event.clientX - canvasRect.left) * CANVAS_WIDTH) / canvasRect.width;
  const y = ((event.clientY - canvasRect.top) * CANVAS_HEIGHT) / canvasRect.height;
  return { x, y };
}

function getDistance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function hexToRgba(hex, alpha) {
  const value = hex.replace('#', '');
  let r;
  let g;
  let b;
  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16);
    g = parseInt(value[1] + value[1], 16);
    b = parseInt(value[2] + value[2], 16);
  } else {
    r = parseInt(value.slice(0, 2), 16);
    g = parseInt(value.slice(2, 4), 16);
    b = parseInt(value.slice(4, 6), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

    }, 900);
  } catch {}
}

function stampStarHeart(point, forceStar = false) {
  const baseSize = Math.max(10, state.size * 1.5);
  const color = state.color;
  const shouldDrawStar = forceStar ? true : state.shapeToggle;
  if (shouldDrawStar) {
    drawStar(point.x, point.y, baseSize * 0.85, color);
  } else {
    drawHeart(point.x, point.y, baseSize, color);
  }
  state.shapeToggle = !shouldDrawStar;
}

function drawStar(x, y, radius, color) {
  const innerRadius = radius * 0.5;
  doodleCtx.save();
  doodleCtx.translate(x, y);
  doodleCtx.rotate((Math.random() - 0.5) * 0.6);
  doodleCtx.beginPath();
  const totalPoints = 5;
  const step = Math.PI / totalPoints;
  for (let index = 0; index < totalPoints * 2; index += 1) {
    const angle = index * step - Math.PI / 2;
    const currentRadius = index % 2 === 0 ? radius : innerRadius;
    const px = Math.cos(angle) * currentRadius;
    const py = Math.sin(angle) * currentRadius;
    if (index === 0) {
      doodleCtx.moveTo(px, py);
    } else {
      doodleCtx.lineTo(px, py);
    }
  }
  doodleCtx.closePath();
  doodleCtx.fillStyle = color;
  doodleCtx.shadowColor = hexToRgba(color, 0.4);
  doodleCtx.shadowBlur = radius * 0.8;
  doodleCtx.fill();
  doodleCtx.restore();
}

function drawHeart(x, y, size, color) {
  const radius = size * 0.55;
  doodleCtx.save();
  doodleCtx.translate(x, y);
  doodleCtx.rotate((Math.random() - 0.5) * 0.4);
  doodleCtx.beginPath();
  doodleCtx.moveTo(0, radius * 0.7);
  doodleCtx.bezierCurveTo(radius, radius * 0.2, radius * 1.1, -radius * 0.6, 0, -radius);
  doodleCtx.bezierCurveTo(-radius * 1.1, -radius * 0.6, -radius, radius * 0.2, 0, radius * 0.7);
  doodleCtx.closePath();
  doodleCtx.fillStyle = color;
  doodleCtx.shadowColor = hexToRgba(color, 0.45);
  doodleCtx.shadowBlur = size * 0.6;
  doodleCtx.fill();
  doodleCtx.restore();
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

init();





















