const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const MAX_HISTORY = 25;
const AUTH_USERS_KEY = 'photo-doodle-users';
const AUTH_ACTIVE_KEY = 'photo-doodle-active-user';
const PROJECT_STORE_KEY = 'photo-doodle-projects';
const MAX_PROJECTS = 10;
const DEFAULT_COLOR = '#ff4b6e';
const DEFAULT_SIZE = 12;
const DEFAULT_ZOOM = 1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.12;

const SOCIAL_PROVIDERS = {
  google: {
    label: 'Google',
  },
  apple: {
    label: 'Apple',
  },
};

const FONT_OPTIONS = [
  {
    value: 'noto-sans',
    label: '简约黑体',
    stack: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    weight: '700',
  },
  {
    value: 'serif-classic',
    label: '经典宋体',
    stack: '"Songti SC", SimSun, serif',
    weight: '700',
  },
  {
    value: 'rounded',
    label: '圆润标题',
    stack: '"Nunito", "Noto Sans SC", sans-serif',
    weight: '700',
  },
  {
    value: 'handwritten',
    label: '活泼手写',
    stack: '"Comic Sans MS", "ZCOOL KuaiLe", cursive',
    weight: '700',
  },
  {
    value: 'calligraphy',
    label: '行书风',
    stack: '"KaiTi", "STKaiti", serif',
    weight: '700',
  },
  {
    value: 'display-impact',
    label: '节庆标题',
    stack: '"Impact", "Arial Black", sans-serif',
    weight: '700',
  },
  {
    value: 'script-soft',
    label: '浪漫英文字体',
    stack: '"Pacifico", "Brush Script MT", cursive',
    weight: '400',
  },
  {
    value: 'neon-bold',
    label: '霓虹风格',
    stack: '"Montserrat", "Noto Sans SC", sans-serif',
    weight: '800',
  },
  {
    value: 'bubble-fun',
    label: '童趣泡泡体',
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

function makeSticker(id, text, label, bg, fg, options = {}) {
  return {
    id,
    text,
    label,
    bg,
    fg,
    fontScale: options.fontScale ?? 0.36,
    fontFamily: options.fontFamily ?? '"Noto Sans SC", "Microsoft YaHei", sans-serif',
    fontWeight: options.fontWeight ?? '700',
    border: options.border ?? 'rgba(0, 0, 0, 0.12)',
    preview: options.preview ?? text.replace(/\n/g, ' '),
  };
}

const STICKER_LIBRARY = {
  birthday: [
    makeSticker('bd-01', '🎂 生日快乐', '生日快乐', '#ffe066', '#2f2a46', {
      preview: '🎂',
      fontScale: 0.34,
    }),
    makeSticker('bd-02', 'Happy\nBirthday', 'Happy Birthday', '#ffd6e6', '#2f2a46', {
      fontScale: 0.34,
    }),
    makeSticker('bd-03', '甜甜蛋糕', '甜甜蛋糕', '#ffc3a0', '#402218'),
    makeSticker('bd-04', '为你庆生', '为你庆生', '#ffe6f7', '#4a2744'),
    makeSticker('bd-05', 'Make a Wish', 'Make a Wish', '#b9e9ff', '#1a3c62', {
      fontScale: 0.32,
      fontFamily: '"Pacifico", "Brush Script MT", cursive',
      fontWeight: '400',
    }),
    makeSticker('bd-06', 'Party Time', 'Party Time', '#ffd6a5', '#42210b', {
      fontScale: 0.32,
    }),
    makeSticker('bd-07', 'Birthday Queen', 'Birthday Queen', '#f7c9ff', '#472a63', {
      fontScale: 0.3,
    }),
    makeSticker('bd-08', 'Birthday King', 'Birthday King', '#e3f2ff', '#1f2a44', {
      fontScale: 0.3,
    }),
    makeSticker('bd-09', '亲友齐聚', '亲友齐聚', '#ffe8cc', '#44281d'),
    makeSticker('bd-10', '生日派对', '生日派对', '#fcd5ce', '#43192d'),
    makeSticker('bd-11', '岁岁平安', '岁岁平安', '#e8f7ff', '#203a43'),
    makeSticker('bd-12', 'Happy 18', 'Happy 18', '#ffc9de', '#301934', {
      fontScale: 0.32,
    }),
    makeSticker('bd-13', 'Happy 21', 'Happy 21', '#ffe5b4', '#42331f', {
      fontScale: 0.32,
    }),
    makeSticker('bd-14', 'Happy 30', 'Happy 30', '#d7c0ff', '#301c51', {
      fontScale: 0.32,
    }),
    makeSticker('bd-15', 'HBD 🎂', 'HBD', '#f1f7ff', '#223f5a', {
      preview: 'HBD',
    }),
    makeSticker('bd-16', '🎉 Surprise!', 'Surprise', '#fff0d1', '#482121', {
      preview: '🎉',
      fontScale: 0.32,
    }),
    makeSticker('bd-17', '吹蜡烛', '吹蜡烛', '#ffdee9', '#3a1f3c'),
    makeSticker('bd-18', 'Happy B-Day', 'Happy B-Day', '#e2f0ff', '#173753', {
      fontScale: 0.32,
    }),
    makeSticker('bd-19', 'Celebrate', 'Celebrate', '#ffe6eb', '#493657', {
      fontScale: 0.32,
    }),
    makeSticker('bd-20', 'Cheers to You', 'Cheers to You', '#fbe7c6', '#3f2e2c', {
      fontScale: 0.3,
    }),
    makeSticker('bd-21', 'Birthday Mood', 'Birthday Mood', '#d8f3dc', '#1b4332', {
      fontScale: 0.3,
    }),
    makeSticker('bd-22', 'Best Wishes', 'Best Wishes', '#ffe0f7', '#3f1d58', {
      fontScale: 0.32,
    }),
    makeSticker('bd-23', '星光闪耀', '星光闪耀', '#f7ebff', '#2e1a47'),
    makeSticker('bd-24', '生日快乐呀', '生日快乐呀', '#ffefc1', '#4a3426'),
    makeSticker('bd-25', 'Happy You Day', 'Happy You Day', '#c6f1ff', '#173c54', {
      fontScale: 0.3,
    }),
  ],
  newYear: [
    makeSticker('ny-01', '🧧 恭喜发财', '恭喜发财', '#ffeadb', '#5b1a18', {
      preview: '🧧',
      fontScale: 0.34,
    }),
    makeSticker('ny-02', '新年快乐', '新年快乐', '#ffe066', '#2f2a46'),
    makeSticker('ny-03', 'Happy\nNew Year', 'Happy New Year', '#f4f1ff', '#2b2d42', {
      fontScale: 0.34,
    }),
    makeSticker('ny-04', '万事如意', '万事如意', '#ffd6a5', '#4a3120'),
    makeSticker('ny-05', '红包拿来', '红包拿来', '#ffcad4', '#66101f'),
    makeSticker('ny-06', '福气满满', '福气满满', '#fff0d1', '#3b1f2b'),
    makeSticker('ny-07', 'Spring\nFestival', 'Spring Festival', '#d7c0ff', '#311f53', {
      fontScale: 0.32,
    }),
    makeSticker('ny-08', '除夕团圆', '除夕团圆', '#ffe5ec', '#521b41'),
    makeSticker('ny-09', '元气满满', '元气满满', '#b9f6ff', '#1a4a5a'),
    makeSticker('ny-10', '平安喜乐', '平安喜乐', '#fef3c7', '#4a3223'),
    makeSticker('ny-11', 'New Year Spark', 'New Year Spark', '#f3d1f4', '#3a1e4d', {
      fontScale: 0.3,
    }),
    makeSticker('ny-12', '2024', '2024', '#e8f7ff', '#123c69', {
      fontScale: 0.36,
      fontFamily: '"Montserrat", "Noto Sans SC", sans-serif',
    }),
    makeSticker('ny-13', '新春快乐', '新春快乐', '#ffd1dc', '#5a1a3c'),
    makeSticker('ny-14', '福运到', '福运到', '#ffe6aa', '#4a2c12'),
    makeSticker('ny-15', '龙腾四海', '龙腾四海', '#f6d5ff', '#321d4f'),
    makeSticker('ny-16', '烟花绽放', '烟花绽放', '#c6f1ff', '#112d4e'),
    makeSticker('ny-17', '好运常在', '好运常在', '#ffeadb', '#5f2a2a'),
    makeSticker('ny-18', '举杯欢庆', '举杯欢庆', '#ffe6f7', '#472a63'),
    makeSticker('ny-19', '开门见喜', '开门见喜', '#fdd2af', '#4c2a1a'),
    makeSticker('ny-20', '福到你家', '福到你家', '#fff0d1', '#482121'),
    makeSticker('ny-21', '迎新纳福', '迎新纳福', '#e4f9f5', '#116466'),
    makeSticker('ny-22', '团圆时刻', '团圆时刻', '#ffe6cc', '#3d1f2b'),
    makeSticker('ny-23', 'Happy Spring', 'Happy Spring', '#d7ecff', '#112a46', {
      fontScale: 0.3,
    }),
    makeSticker('ny-24', 'Lucky Star', 'Lucky Star', '#fde2ff', '#311f53', {
      fontScale: 0.32,
    }),
    makeSticker('ny-25', '辞旧迎新', '辞旧迎新', '#f7fff6', '#1b4332'),
  ],
  anniversary: [
    makeSticker('an-01', '纪念日快乐', '纪念日快乐', '#ffe6f2', '#5a2d59'),
    makeSticker('an-02', 'Love\nYou Forever', 'Love You Forever', '#dfe7ff', '#2d3f72', {
      fontScale: 0.3,
      fontFamily: '"Pacifico", "Brush Script MT", cursive',
      fontWeight: '400',
    }),
    makeSticker('an-03', '在一起\n第一年', '在一起第一年', '#ffe0d6', '#6d2c3b'),
    makeSticker('an-04', '执子之手', '执子之手', '#f8f0ff', '#4a2f73'),
    makeSticker('an-05', '余生请多指教', '余生请多指教', '#fff5d7', '#5a3e2c'),
    makeSticker('an-06', '我们的宇宙', '我们的宇宙', '#e4f6ff', '#1d3557'),
    makeSticker('an-07', 'Heart & Soul', 'Heart & Soul', '#ffd9ec', '#521b41', {
      fontScale: 0.32,
    }),
    makeSticker('an-08', '甜蜜时刻', '甜蜜时刻', '#ffe7d1', '#5c2d1f'),
    makeSticker('an-09', '周年旅行', '周年旅行', '#dff7f9', '#145a70'),
    makeSticker('an-10', '相伴到老', '相伴到老', '#f3e5ff', '#452e72'),
    makeSticker('an-11', '第5周年', '第5周年', '#ffe0ef', '#511f39'),
    makeSticker('an-12', '第10周年', '第10周年', '#fdebd3', '#6a381c'),
    makeSticker('an-13', '嫁给幸福', '嫁给幸福', '#ffeef5', '#7a2f43'),
    makeSticker('an-14', 'Always Yours', 'Always Yours', '#e8f0ff', '#243b6b', {
      fontScale: 0.32,
    }),
    makeSticker('an-15', '锁定爱意', '锁定爱意', '#fce1ff', '#4d1a66'),
    makeSticker('an-16', '约定终身', '约定终身', '#fff1d6', '#523423'),
    makeSticker('an-17', 'Marry Me Again', 'Marry Me Again', '#e6f5ff', '#1f3e64', {
      fontScale: 0.3,
    }),
    makeSticker('an-18', '恋人节', '恋人节', '#ffdfe5', '#7b2741'),
    makeSticker('an-19', '我们的故事', '我们的故事', '#fff5f0', '#53302b'),
    makeSticker('an-20', '幸福坐标', '幸福坐标', '#e4fff5', '#1c6b4a'),
    makeSticker('an-21', '双人小宇宙', '双人小宇宙', '#e8f4ff', '#27406b'),
    makeSticker('an-22', 'Till The End', 'Till The End', '#f7ddff', '#472a63', {
      fontScale: 0.32,
    }),
    makeSticker('an-23', '锁住此刻', '锁住此刻', '#ffeacd', '#6a3e1f'),
    makeSticker('an-24', '520 纪念', '520 纪念', '#ffcfe1', '#5a2341'),
    makeSticker('an-25', 'Best Pair Ever', 'Best Pair Ever', '#f1f8ff', '#1b3a57', {
      fontScale: 0.3,
    }),
  ],
  party: [
    makeSticker('pt-01', 'Party\nTime', 'Party Time', '#ffeecf', '#56341f', {
      fontScale: 0.34,
    }),
    makeSticker('pt-02', 'Dance All Night', 'Dance All Night', '#e2f4ff', '#1f3a64', {
      fontScale: 0.3,
    }),
    makeSticker('pt-03', '狂欢开场', '狂欢开场', '#ffd9e8', '#551c41'),
    makeSticker('pt-04', 'Happy Hour', 'Happy Hour', '#fff5d6', '#6b351d'),
    makeSticker('pt-05', 'DJ On Fire', 'DJ On Fire', '#dff9ff', '#124d63', {
      fontScale: 0.3,
    }),
    makeSticker('pt-06', '狂热现场', '狂热现场', '#f4e5ff', '#422b70'),
    makeSticker('pt-07', '灯光闪耀', '灯光闪耀', '#ffe0f2', '#5a2151'),
    makeSticker('pt-08', 'Cheer Up!', 'Cheer Up!', '#f8f0d8', '#663f22', {
      fontScale: 0.34,
    }),
    makeSticker('pt-09', '舞池见', '舞池见', '#e6fff6', '#13694a'),
    makeSticker('pt-10', '派对邀请', '派对邀请', '#ffe7d6', '#6a311c'),
    makeSticker('pt-11', 'Swag Night', 'Swag Night', '#dde6ff', '#1f2f66', {
      fontScale: 0.32,
    }),
    makeSticker('pt-12', '微醺瞬间', '微醺瞬间', '#fbe2ff', '#4d1d66'),
    makeSticker('pt-13', '最佳造型', '最佳造型', '#ffefd6', '#57422d'),
    makeSticker('pt-14', '举杯同庆', '举杯同庆', '#ffe6eb', '#5b2e3c'),
    makeSticker('pt-15', 'Let’s Groove', 'Let’s Groove', '#e2f0ff', '#1f3f68', {
      fontScale: 0.3,
    }),
    makeSticker('pt-16', 'Glow Up', 'Glow Up', '#fef3c7', '#614218'),
    makeSticker('pt-17', '闪耀夜', '闪耀夜', '#f2deff', '#412d70'),
    makeSticker('pt-18', 'Team Celebration', 'Team Celebration', '#ddf9f0', '#185a4a', {
      fontScale: 0.28,
    }),
    makeSticker('pt-19', 'Best Squad', 'Best Squad', '#f1f8ff', '#1f3f5a', {
      fontScale: 0.3,
    }),
    makeSticker('pt-20', '派对女王', '派对女王', '#ffe2f1', '#6a234b'),
    makeSticker('pt-21', '派对男神', '派对男神', '#e5edff', '#1f3d76'),
    makeSticker('pt-22', '午夜烟火', '午夜烟火', '#fff0d9', '#56341d'),
    makeSticker('pt-23', '律动心跳', '律动心跳', '#e6faff', '#13506a'),
    makeSticker('pt-24', '庆祝胜利', '庆祝胜利', '#f3ffea', '#29552a'),
    makeSticker('pt-25', 'Sparkle Night', 'Sparkle Night', '#ffe6ff', '#4c1f73', {
      fontScale: 0.32,
    }),
  ],
  blessing: [
    makeSticker('bl-01', '喜乐安康', '喜乐安康', '#fff3d9', '#5c3a17'),
    makeSticker('bl-02', 'Good Vibes', 'Good Vibes', '#e6f8ff', '#1f3f6a', {
      fontScale: 0.32,
    }),
    makeSticker('bl-03', '心想事成', '心想事成', '#ffe7f2', '#5b2a4a'),
    makeSticker('bl-04', '好运连连', '好运连连', '#ffefd6', '#573f1f'),
    makeSticker('bl-05', 'Shine Bright', 'Shine Bright', '#e2f4ff', '#21395c', {
      fontScale: 0.32,
    }),
    makeSticker('bl-06', '梦想开花', '梦想开花', '#fff1ec', '#5c3228'),
    makeSticker('bl-07', 'Happy For You', 'Happy For You', '#f0f5ff', '#1e3f6b', {
      fontScale: 0.3,
    }),
    makeSticker('bl-08', '光芒万丈', '光芒万丈', '#fef3c7', '#6b4218'),
    makeSticker('bl-09', '勇敢闪耀', '勇敢闪耀', '#e7ffe9', '#205b35'),
    makeSticker('bl-10', '加油打气', '加油打气', '#e8f8ff', '#205a7a'),
    makeSticker('bl-11', '顺顺利利', '顺顺利利', '#fff0d6', '#6a3d1c'),
    makeSticker('bl-12', 'Hugs & Wishes', 'Hugs & Wishes', '#ffe4f0', '#5d2352', {
      fontScale: 0.3,
    }),
    makeSticker('bl-13', '平安喜乐', '平安喜乐', '#f3fff4', '#215c32'),
    makeSticker('bl-14', 'Blessed Day', 'Blessed Day', '#e0f1ff', '#243f6a', {
      fontScale: 0.32,
    }),
    makeSticker('bl-15', '花开有时', '花开有时', '#ffe9f0', '#6b2a43'),
    makeSticker('bl-16', '喜气洋洋', '喜气洋洋', '#ffe8cc', '#5a2c17'),
    makeSticker('bl-17', '拥抱当下', '拥抱当下', '#e7faff', '#245b70'),
    makeSticker('bl-18', '心怀感恩', '心怀感恩', '#fff6df', '#5c3f20'),
    makeSticker('bl-19', '开心就好', '开心就好', '#f1e8ff', '#382d72'),
    makeSticker('bl-20', '幸福常伴', '幸福常伴', '#ffe4ec', '#632f41'),
    makeSticker('bl-21', '好运锦囊', '好运锦囊', '#fff0dc', '#6d3a1b'),
    makeSticker('bl-22', '心暖如光', '心暖如光', '#eafcff', '#246c7a'),
    makeSticker('bl-23', '元气满满', '元气满满', '#f3fff0', '#1f6c3b'),
    makeSticker('bl-24', 'New Chapter', 'New Chapter', '#e2f0ff', '#1f3a6a', {
      fontScale: 0.32,
    }),
    makeSticker('bl-25', '每天都美好', '每天都美好', '#ffe8f5', '#5a2d4a'),
  ],
  seasonal: [
    makeSticker('sn-01', '春日出游', '春日出游', '#e8ffe9', '#1f6a3a'),
    makeSticker('sn-02', '夏日海风', '夏日海风', '#dff5ff', '#13496b'),
    makeSticker('sn-03', '秋夜星河', '秋夜星河', '#fff1d6', '#5a3a1f'),
    makeSticker('sn-04', '冬日暖阳', '冬日暖阳', '#f5f1ff', '#2f3a6a'),
    makeSticker('sn-05', '樱花限定', '樱花限定', '#ffe3f1', '#6a2c4d'),
    makeSticker('sn-06', '仲夏派对', '仲夏派对', '#e6fff6', '#1c6b4a'),
    makeSticker('sn-07', '收获满满', '收获满满', '#ffedd6', '#5f381f'),
    makeSticker('sn-08', '雪花轻舞', '雪花轻舞', '#e5f2ff', '#234a74'),
    makeSticker('sn-09', 'Spring Bloom', 'Spring Bloom', '#f6ffe8', '#2f6a31', {
      fontScale: 0.32,
    }),
    makeSticker('sn-10', 'Summer Chill', 'Summer Chill', '#e0f8ff', '#195a74', {
      fontScale: 0.32,
    }),
    makeSticker('sn-11', 'Autumn Cozy', 'Autumn Cozy', '#ffe9d6', '#5f3a1f'),
    makeSticker('sn-12', 'Winter Magic', 'Winter Magic', '#e7efff', '#2a3d72', {
      fontScale: 0.3,
    }),
    makeSticker('sn-13', '清凉一夏', '清凉一夏', '#e3fff6', '#176a56'),
    makeSticker('sn-14', '落叶缤纷', '落叶缤纷', '#ffe7cc', '#6b3b1f'),
    makeSticker('sn-15', '踏雪寻梅', '踏雪寻梅', '#f2f4ff', '#2d4574'),
    makeSticker('sn-16', '暖春花事', '暖春花事', '#ffe9f6', '#6a2a4e'),
    makeSticker('sn-17', '夏夜烟花', '夏夜烟花', '#e9f8ff', '#1f4f7a'),
    makeSticker('sn-18', '秋收祝福', '秋收祝福', '#fff0de', '#5a381e'),
    makeSticker('sn-19', '冬季热饮', '冬季热饮', '#f7efe6', '#5d3f24'),
    makeSticker('sn-20', '立春好运', '立春好运', '#eaffea', '#1f6a37'),
    makeSticker('sn-21', '盛夏派对', '盛夏派对', '#def6ff', '#154e78'),
    makeSticker('sn-22', '金秋庆典', '金秋庆典', '#ffe7cf', '#6c421f'),
    makeSticker('sn-23', '暖冬相聚', '暖冬相聚', '#f4f0ff', '#2e3f72'),
    makeSticker('sn-24', '四季如春', '四季如春', '#e7ffe7', '#1f6b3a'),
    makeSticker('sn-25', 'Seasonal Love', 'Seasonal Love', '#f0f3ff', '#253a70', {
      fontScale: 0.32,
    }),
  ],
};

const state = {
  mode: 'draw',
  tool: 'starHeart',
  color: DEFAULT_COLOR,
  size: DEFAULT_SIZE,
  isDrawing: false,
  hasPhoto: false,
  cameraStream: null,
  cameraReady: false,
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
  mode: 'login',
  isAuthenticated: false,
  currentUser: null,
};

const elements = {
  video: document.getElementById('cameraPreview'),
  status: document.getElementById('cameraStatus'),
  overlay: document.getElementById('cameraOverlay'),
  startCamera: document.getElementById('startCamera'),
  capturePhoto: document.getElementById('capturePhoto'),
  stopCamera: document.getElementById('stopCamera'),
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
  updateCameraControls();
  updatePanStateClasses();
  announce('请登录后开启相机或上传照片。');
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
  elements.startCamera.addEventListener('click', () => {
    if (!ensureAuthenticated()) {
      return;
    }
    startCamera().catch(() => {
      /* 提示已在 startCamera 内处理 */
    });
  });
  elements.stopCamera.addEventListener('click', () => {
    if (!ensureAuthenticated()) {
      return;
    }
    stopCamera();
  });
  elements.capturePhoto.addEventListener('click', () => {
    if (!ensureAuthenticated()) {
      return;
    }
    capturePhoto();
  });
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

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopCamera();
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
    console.warn('无法恢复登录状态：', error);
  }
  updateAuthUI();
  updateViewControls();
}
function handleAuthSubmit(event) {
  event.preventDefault();
  const email = elements.authEmail.value.trim().toLowerCase();
  const password = elements.authPassword.value.trim();
  if (!validateEmail(email)) {
    showAuthMessage('请输入有效的邮箱地址。');
    elements.authEmail.focus();
    return;
  }
  if (password.length < 6) {
    showAuthMessage('密码至少 6 位，请重新输入。');
    elements.authPassword.focus();
    return;
  }

  const users = loadUsers();
  const index = users.findIndex((user) => user.email === email);
  const existingUser = index >= 0 ? users[index] : null;

  if (authState.mode === 'login') {
    if (!existingUser) {
      showAuthMessage('未找到该邮箱，请先注册或使用社交登录。');
      return;
    }
    if (!existingUser.password) {
      showAuthMessage('该账号通过社交方式注册，请使用下方社交登录按钮。');
      return;
    }
    if (existingUser.password !== password) {
      showAuthMessage('密码不正确，请重试。');
      return;
    }
    users[index] = { ...existingUser, lastLoginAt: Date.now() };
    saveUsers(users);
    elements.authForm.reset();
    completeLogin(users[index], '登录成功，开始创作吧！', '登录成功，请选择照片或开启相机。');
    return;
  }

  if (existingUser) {
    showAuthMessage('该邮箱已注册，请直接登录或使用社交登录。');
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
  completeLogin(newUser, '注册成功，已自动登录。', '注册成功，快来拍摄或上传照片吧！');
}

function toggleAuthMode() {
  authState.mode = authState.mode === 'login' ? 'register' : 'login';
  updateAuthMode();
  showAuthMessage(
    authState.mode === 'login' ? '欢迎回来，请登录体验全部功能。' : '设置一个邮箱账号即可解锁创作功能。',
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
    return providerLabels ? `${name}（${user.email}） · ${providerLabels}` : `${name}（${user.email}）`;
  }
  const base = `已登录：${user.email}`;
  return providerLabels ? `${base} · ${providerLabels}` : base;
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
  updateCameraControls();
  updateViewControls();
  renderProjectList();
  if (!authed) {
    state.projects = [];
    state.activeProjectId = null;
    if (elements.projectName) {
      elements.projectName.value = '';
    }
    showOverlay('请登录后开启相机或上传照片。');
  }
}

function updateAuthMode() {
  const isRegister = authState.mode === 'register';
  elements.authSubmit.textContent = isRegister ? '注册并登录' : '登录';
  elements.authToggle.textContent = isRegister ? '我已有账号，去登录' : '我需要注册';
}

function signOut() {
  authState.isAuthenticated = false;
  authState.currentUser = null;
  localStorage.removeItem(AUTH_ACTIVE_KEY);
  showAuthMessage('已退出，请重新登录。');
  announce('已退出登录，作品已清空。');
  stopCamera();
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

function loadUsers() {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    if (!raw) {
      return [];
    }
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data.map(normalizeUser).filter(Boolean);
    }
  } catch (error) {
    console.warn('读取用户数据失败：', error);
  }
  return [];
}

function saveUsers(users) {
  try {
    const serialized = users.map(serializeUser);
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.warn('保存用户数据失败：', error);
  }
}

function normalizeUser(raw) {
  if (!raw || typeof raw.email !== 'string') {
    return null;
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

function serializeUser(user) {
  return {
    email: user.email,
    password: typeof user.password === 'string' ? user.password : null,
    providers: Array.isArray(user.providers) ? user.providers : [],
    displayName: user.displayName ?? '',
    createdAt: typeof user.createdAt === 'number' ? user.createdAt : Date.now(),
    lastLoginAt: typeof user.lastLoginAt === 'number' ? user.lastLoginAt : Date.now(),
  };
}

function loadProjectStore() {
  try {
    const raw = localStorage.getItem(PROJECT_STORE_KEY);
    if (!raw) {
      return {};
    }
    const data = JSON.parse(raw);
    if (data && typeof data === 'object') {
      return data;
    }
  } catch (error) {
    console.warn('读取作品数据失败：', error);
  }
  return {};
}

function saveProjectStore(store) {
  try {
    localStorage.setItem(PROJECT_STORE_KEY, JSON.stringify(store));
  } catch (error) {
    console.warn('保存作品数据失败：', error);
  }
}

function loadProjectsForUser(email) {
  if (!email) {
    return [];
  }
  const store = loadProjectStore();
  const raw = Array.isArray(store[email]) ? store[email] : [];
  return raw.map(normalizeProject).filter(Boolean).sort((a, b) => b.updatedAt - a.updatedAt);
}

function saveProjectsForUser(email, projects) {
  if (!email) {
    return;
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

function normalizeProject(raw) {
  if (!raw || typeof raw.id !== 'string') {
    return null;
  }
  const view = raw.view && typeof raw.view === 'object' ? raw.view : {};
  return {
    id: raw.id,
    name: typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : '未命名作品',
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

function serializeProject(project) {
  return {
    id: project.id,
    name: project.name,
    photo: project.photo,
    doodle: project.doodle,
    updatedAt: project.updatedAt,
    view: {
      zoom: project.view?.zoom ?? DEFAULT_ZOOM,
      offsetX: project.view?.offsetX ?? 0,
      offsetY: project.view?.offsetY ?? 0,
    },
  };
}

function deriveDisplayName(email) {
  if (!email) {
    return '创作者';
  }
  const [name] = email.split('@');
  return name || '创作者';
}

function handleSaveProject() {
  if (!ensureAuthenticated()) {
    return;
  }
  if (!state.hasPhoto) {
    highlightPlaceholder();
    showAuthMessage('请先拍摄或上传照片，再保存作品。');
    announce('需先载入照片后才能保存作品。');
    return;
  }
  let projectName = elements.projectName?.value.trim() ?? '';
  if (!projectName) {
    const now = new Date();
    const dateText = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
    projectName = `未命名作品 ${dateText}`;
  }
  let photoData = '';
  let doodleData = '';
  try {
    photoData = photoCanvas.toDataURL('image/png');
    doodleData = doodleCanvas.toDataURL('image/png');
  } catch (error) {
    console.warn('保存作品时生成图像数据失败：', error);
    announce('保存失败，浏览器不支持导出当前画布。');
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
  showAuthMessage('作品已保存至本地作品库。');
  announce('当前作品已保存，可在列表中重新加载。');
}

function handleNewProject() {
  if (!ensureAuthenticated()) {
    return;
  }
  const shouldConfirm = state.hasPhoto || doodleHistory.length > 0;
  if (shouldConfirm) {
    const proceed = window.confirm('当前作品尚未保存，确定要创建新的空白作品吗？');
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
  showAuthMessage('已创建新的空白作品。');
  announce('新的空白作品已就绪，请先拍摄或上传照片。');
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
    hint.textContent = '登录后可保存作品，列表会出现在这里。';
    container.appendChild(hint);
    return;
  }
  if (!state.projects.length) {
    const empty = document.createElement('p');
    empty.className = 'hint-text';
    empty.textContent = '暂无保存的作品，创作完成后点击“保存进度”。';
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
      loadButton.textContent = '载入';
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.className = 'project-action delete';
      deleteButton.dataset.projectAction = 'delete';
      deleteButton.textContent = '删除';
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
    announce('未找到对应的作品记录。');
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
      announce(`已载入作品：${project.name}`);
    })
    .catch((error) => {
      console.warn('载入作品失败：', error);
      announce('作品载入失败，请稍后再试。');
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
    showAuthMessage('已删除该作品，当前画面仍保留，可继续编辑或另存。');
  } else {
    showAuthMessage('作品已从列表中移除。');
  }
  renderProjectList();
  if (removed && elements.projectName && state.activeProjectId === null) {
    elements.projectName.value = '';
  }
}

function formatProjectTimestamp(timestamp) {
  if (!timestamp) {
    return '';
  }
  const diff = Date.now() - timestamp;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) {
    return '刚刚更新';
  }
  if (diff < hour) {
    const value = Math.max(1, Math.floor(diff / minute));
    return `${value} 分钟前更新`;
  }
  if (diff < day) {
    const value = Math.max(1, Math.floor(diff / hour));
    return `${value} 小时前更新`;
  }
  const date = new Date(timestamp);
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} 更新`;
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

function validateEmail(email) {
  return /.+@.+\..+/.test(email);
}

function ensureAuthenticated() {
  if (authState.isAuthenticated) {
    if (elements.authMessage.textContent) {
      showAuthMessage('');
    }
    return true;
  }
  showAuthMessage('请先登录以使用全部创作功能。');
  elements.authEmail.focus();
  return false;
}

function showAuthMessage(message) {
  elements.authMessage.textContent = message;
}

function handleSocialSignIn(providerKey) {
  const provider = SOCIAL_PROVIDERS[providerKey];
  if (!provider) {
    showAuthMessage('暂不支持该社交登录方式。');
    return;
  }
  const emailInput = window.prompt(`使用 ${provider.label} 登录，请输入邮箱地址：`);
  if (!emailInput) {
    showAuthMessage('已取消社交登录。');
    return;
  }
  const email = emailInput.trim().toLowerCase();
  if (!validateEmail(email)) {
    showAuthMessage('请输入有效的邮箱地址。');
    return;
  }
  let displayNameInput = window.prompt('可选：输入一个创作时显示的昵称（留空则使用邮箱前缀）');
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
      `${provider.label} 登录成功，开始创作吧！`,
      `${provider.label} 登录成功，可继续创作。`,
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
    `${provider.label} 登录成功，欢迎加入！`,
    `${provider.label} 登录成功，可继续创作。`,
  );
}

function isCameraSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function updateCameraControls() {
  const active = Boolean(state.cameraStream);
  const locked = !authState.isAuthenticated;
  elements.startCamera.disabled = locked || active;
  elements.stopCamera.disabled = locked || !active;
  elements.capturePhoto.disabled = locked || !state.cameraReady;
}

async function startCamera() {
  if (!isCameraSupported()) {
    disableCameraControls();
    throw new Error('Camera not supported');
  }

  try {
    announce('正在请求摄像头权限…');
    elements.startCamera.disabled = true;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    });

    state.cameraStream = stream;
    elements.video.srcObject = stream;
    await playVideo(elements.video);
    state.cameraReady = true;
    hideOverlay();
    announce('摄像头已开启，可以点击“拍摄照片”捕捉画面。');
  } catch (error) {
    const message = error?.name === 'NotAllowedError'
      ? '访问摄像头被拒绝，请检查浏览器权限设置。'
      : `无法访问摄像头：${error?.message ?? '未知错误'}`;
    announce(message);
    stopCamera();
    throw error;
  } finally {
    updateCameraControls();
  }
}

function disableCameraControls() {
  elements.startCamera.disabled = true;
  elements.capturePhoto.disabled = true;
  elements.stopCamera.disabled = true;
}

function stopCamera() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach((track) => track.stop());
    state.cameraStream = null;
  }
  if (elements.video.srcObject) {
    elements.video.srcObject = null;
  }
  state.cameraReady = false;
  showOverlay('已关闭摄像头，如需重新拍摄请点击“开启相机”。');
  updateCameraControls();
}

function playVideo(videoElement) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      videoElement.removeEventListener('loadeddata', onLoaded);
      videoElement.removeEventListener('error', onError);
    };
    const onLoaded = () => {
      cleanup();
      resolve();
    };
    const onError = (error) => {
      cleanup();
      reject(error);
    };
    videoElement.addEventListener('loadeddata', onLoaded, { once: true });
    videoElement.addEventListener('error', onError, { once: true });
    const playPromise = videoElement.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(onError);
    }
  });
}

function capturePhoto() {
  if (!state.cameraReady || !elements.video.videoWidth) {
    announce('摄像头尚未准备就绪，请稍候或重新开启。');
    return;
  }
  drawSourceToPhoto(elements.video, elements.video.videoWidth, elements.video.videoHeight);
  resetDoodleCanvas();
  announce('已捕捉当前画面，快来绘制你的祝福吧！');
}

function handleUpload(event) {
  const [file] = event.target.files;
  
  if (!file) {
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    announce('图片超过 10 MB 限制，请选择更小的文件。');
    event.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    const image = new Image();
    image.onload = () => {
      drawSourceToPhoto(image, image.width, image.height);
      resetDoodleCanvas();
      announce('图片已载入，可以继续创作。');
    };
    image.onerror = () => {
      announce('图片加载失败，请尝试其他文件或稍后再试。');
    };
    image.src = String(loadEvent.target?.result);
  };
  reader.onerror = () => {
    announce('读取图片文件时发生错误，请重新选择文件。');
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

function updateStickerCategory() {
  elements.stickerTabs.forEach((tab) => {
    const isActive = tab.dataset.stickerCategory === state.stickerCategory;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-pressed', String(isActive));
  });
}

function renderStickerList() {
  const container = elements.stickerList;
  container.innerHTML = '';
  const list = STICKER_LIBRARY[state.stickerCategory] ?? [];
  if (!list.length) {
    return;
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

function selectSticker(stickerId) {
  state.selectedStickerId = stickerId;
  state.mode = 'sticker';
  cancelTextPlacement();
  updateStickerSelection();
  updateStickerMode();
  announce('贴纸放置模式已开启，点击画布即可放置。');
}

function updateStickerSelection() {
  const buttons = elements.stickerList.querySelectorAll('.sticker-button');
  buttons.forEach((button) => {
    const isActive = button.dataset.stickerId === state.selectedStickerId;
    button.classList.toggle('active', isActive);
    button.disabled = !authState.isAuthenticated;
  });
}

function updateStickerMode(silent = false) {
  const isStickerMode = state.mode === 'sticker' && state.selectedStickerId;
  elements.exitStickerMode.disabled = !isStickerMode || !authState.isAuthenticated;
  if (!silent && !isStickerMode) {
    announce('已退出贴纸放置模式。');
  }
}

function exitStickerMode(silent = false) {
  if (state.mode !== 'sticker' && !state.selectedStickerId) {
    return;
  }
  state.mode = 'draw';
  state.selectedStickerId = null;
  updateStickerSelection();
  updateStickerMode(silent);
}

function updateTextButton() {
  if (!state.pendingText) {
    elements.placeText.textContent = '点击画布放置';
    elements.placeText.disabled = !authState.isAuthenticated;
  }
}

function prepareTextPlacement() {
  if (!ensureAuthenticated()) {
    return;
  }
  if (!state.hasPhoto) {
    highlightPlaceholder();
    announce('请先拍摄或上传一张照片。');
    return;
  }
  const text = elements.textContent.value.trim();
  if (!text) {
    announce('请输入想要放置的文本内容。');
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
  elements.placeText.textContent = '在画布点击放置…';
  elements.placeText.disabled = true;
  announce('文本放置模式已开启，请在画布上点击位置。');
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
    showAuthMessage('请先登录以进行涂鸦、文本或贴纸操作。');
    elements.authEmail.focus();
    return;
  }
  if (maybeBeginPan(event)) {
    return;
  }
  if (!state.hasPhoto) {
    highlightPlaceholder();
    announce('请先拍摄或上传一张照片。');
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
    /* 某些浏览器在多指触控时可能不支持 Pointer Capture，可忽略 */
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
    /* 忽略 Pointer Capture 释放异常 */
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
  announce('文本已放置在画布上。');
}

function placeSticker(point) {
  const sticker = getSelectedSticker();
  if (!sticker) {
    return;
  }
  drawSticker(point.x, point.y, sticker, state.stickerSize);
  announce('贴纸已放置，可继续点击添加更多。');
}

function getSelectedSticker() {
  const list = STICKER_LIBRARY[state.stickerCategory] ?? [];
  return list.find((item) => item.id === state.selectedStickerId) ?? null;
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
    announce('没有可撤销的笔画。');
    return;
  }
  const snapshot = doodleHistory.pop();
  doodleCtx.putImageData(snapshot, 0, 0);
  announce('已撤销上一笔操作。');
}

function clearDoodle() {
  if (!state.hasPhoto && doodleHistory.length === 0) {
    return;
  }
  pushHistory();
  clearCanvas(doodleCtx);
  cancelTextPlacement();
  exitStickerMode(true);
  announce('画布已清空，可以重新开始创作。');
}

function resetDoodleCanvas() {
  doodleHistory.length = 0;
  clearCanvas(doodleCtx);
  cancelTextPlacement();
  exitStickerMode(true);
}

function exportImage() {
  if (!state.hasPhoto) {
    announce('请先拍摄或上传一张照片，再导出作品。');
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
  announce('PNG 文件已生成，可直接保存或分享。');
}

function pushHistory() {
  try {
    const snapshot = doodleCtx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    doodleHistory.push(snapshot);
    if (doodleHistory.length > MAX_HISTORY) {
      doodleHistory.shift();
    }
  } catch (error) {
    console.warn('无法记录撤销历史：', error);
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
    announce('画布视图已重置。');
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
    /* 某些浏览器在多指操作时可能不支持 Pointer Capture，可忽略 */
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
    /* 忽略 Pointer Capture 释放失败 */
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

function announce(message) {
  elements.status.textContent = message;
}

function updatePlaceholder() {
  elements.canvasPlaceholder.classList.toggle('hidden', state.hasPhoto);
}

function highlightPlaceholder() {
  elements.canvasPlaceholder.classList.remove('hidden');
  elements.canvasPlaceholder.classList.add('flash');
  setTimeout(() => {
    elements.canvasPlaceholder.classList.remove('flash');
    updatePlaceholder();
  }, 900);
}

function hideOverlay() {
  elements.overlay.classList.add('hidden');
}

function showOverlay(message) {
  elements.overlay.innerHTML = `<p>${message}</p>`;
  elements.overlay.classList.remove('hidden');
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

// --- Camera-free overrides and safe guards ---
// In the new flow we only support photo upload; camera APIs are no-ops.
function isCameraSupported() {
  return false;
}
function updateCameraControls() {
  if (elements && elements.startCamera) elements.startCamera.disabled = true;
  if (elements && elements.capturePhoto) elements.capturePhoto.disabled = true;
  if (elements && elements.stopCamera) elements.stopCamera.disabled = true;
}
async function startCamera() {
  announce('当前版本仅支持上传照片进行创作');
  return Promise.resolve();
}
function stopCamera() {}
function playVideo() {}
function capturePhoto() {}

// Announce/overlay fallbacks when camera UI is absent
function announce(message) {
  try {
    if (authState && authState.isAuthenticated && elements && elements.authMessage) {
      elements.authMessage.textContent = String(message);
    }
  } catch {}
}
function hideOverlay() {
  try {
    if (elements && elements.overlay) elements.overlay.classList.add('hidden');
  } catch {}
}
function showOverlay(message) {
  try {
    if (elements && elements.overlay) {
      elements.overlay.innerHTML = `<p>${String(message)}</p>`;
      elements.overlay.classList.remove('hidden');
    }
  } catch {}
}

