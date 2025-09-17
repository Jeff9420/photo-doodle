export function makeSticker(id, text, label, bg, fg, options = {}) {
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

export const STICKER_LIBRARY = {
  birthday: [
    makeSticker('bd-01', '🎂 生日快乐', '生日快乐', '#ffe066', '#2f2a46', { preview: '🎂', fontScale: 0.34 }),
    makeSticker('bd-02', 'Happy\nBirthday', 'Happy Birthday', '#ffd6e6', '#2f2a46', { fontScale: 0.34 }),
    makeSticker('bd-03', '甜甜蛋糕', '甜甜蛋糕', '#ffc3a0', '#402218'),
    makeSticker('bd-04', '为你庆生', '为你庆生', '#ffe6f7', '#4a2744'),
    makeSticker('bd-05', 'Make a Wish', 'Make a Wish', '#b9e9ff', '#1a3c62', { fontScale: 0.32, fontFamily: '"Pacifico", "Brush Script MT", cursive', fontWeight: '400' }),
    makeSticker('bd-06', 'Party Time', 'Party Time', '#ffd6a5', '#42210b', { fontScale: 0.32 }),
    makeSticker('bd-07', 'Birthday Queen', 'Birthday Queen', '#f7c9ff', '#472a63', { fontScale: 0.3 }),
    makeSticker('bd-08', 'Birthday King', 'Birthday King', '#e3f2ff', '#1f2a44', { fontScale: 0.3 }),
    makeSticker('bd-09', '亲友齐聚', '亲友齐聚', '#ffe8cc', '#44281d'),
    makeSticker('bd-10', '生日派对', '生日派对', '#fcd5ce', '#43192d'),
    makeSticker('bd-11', '岁岁平安', '岁岁平安', '#e8f7ff', '#203a43'),
    makeSticker('bd-12', 'Happy 18', 'Happy 18', '#ffc9de', '#301934', { fontScale: 0.32 }),
    makeSticker('bd-13', 'Happy 21', 'Happy 21', '#ffe5b4', '#42331f', { fontScale: 0.32 }),
    makeSticker('bd-14', 'Happy 30', 'Happy 30', '#d7c0ff', '#301c51', { fontScale: 0.32 }),
    makeSticker('bd-15', 'HBD 🎂', 'HBD', '#f1f7ff', '#223f5a', { preview: 'HBD' }),
    makeSticker('bd-16', '🎉 Surprise!', 'Surprise', '#fff0d1', '#482121', { preview: '🎉', fontScale: 0.32 }),
    makeSticker('bd-17', '吹蜡烛', '吹蜡烛', '#ffdee9', '#3a1f3c'),
    makeSticker('bd-18', 'Happy B-Day', 'Happy B-Day', '#e2f0ff', '#173753', { fontScale: 0.32 }),
    makeSticker('bd-19', 'Celebrate', 'Celebrate', '#ffe6eb', '#493657', { fontScale: 0.32 }),
    makeSticker('bd-20', 'Cheers to You', 'Cheers to You', '#fbe7c6', '#3f2e2c', { fontScale: 0.3 }),
    makeSticker('bd-21', 'Birthday Mood', 'Birthday Mood', '#d8f3dc', '#1b4332', { fontScale: 0.3 }),
    makeSticker('bd-22', 'Best Wishes', 'Best Wishes', '#ffe0f7', '#3f1d58', { fontScale: 0.32 }),
    makeSticker('bd-23', '星光闪耀', '星光闪耀', '#f7ebff', '#2e1a47'),
    makeSticker('bd-24', '生日快乐呀', '生日快乐呀', '#ffefc1', '#4a3426'),
    makeSticker('bd-25', 'Happy You Day', 'Happy You Day', '#c6f1ff', '#173c54', { fontScale: 0.3 }),
  ],
  newYear: [
    makeSticker('ny-01', '🧧 恭喜发财', '恭喜发财', '#ffeadb', '#5b1a18', { preview: '🧧', fontScale: 0.34 }),
    makeSticker('ny-02', '新年快乐', '新年快乐', '#ffe066', '#2f2a46'),
    makeSticker('ny-03', 'Happy\nNew Year', 'Happy New Year', '#f4f1ff', '#2b2d42', { fontScale: 0.34 }),
    makeSticker('ny-04', '万事如意', '万事如意', '#ffd6a5', '#4a3120'),
    makeSticker('ny-05', '红包拿来', '红包拿来', '#ffcad4', '#66101f'),
    makeSticker('ny-06', '福气满满', '福气满满', '#fff0d1', '#3b1f2b'),
    makeSticker('ny-07', 'Spring\nFestival', 'Spring Festival', '#d7c0ff', '#311f53', { fontScale: 0.32 }),
    makeSticker('ny-08', '除夕团圆', '除夕团圆', '#ffe5ec', '#521b41'),
    makeSticker('ny-09', '元气满满', '元气满满', '#b9f6ff', '#1a4a5a'),
    makeSticker('ny-10', '平安喜乐', '平安喜乐', '#fef3c7', '#4a3223'),
    makeSticker('ny-11', 'New Year Spark', 'New Year Spark', '#f3d1f4', '#3a1e4d', { fontScale: 0.3 }),
    makeSticker('ny-12', '2024', '2024', '#e8f7ff', '#123c69', { fontScale: 0.36, fontFamily: '"Montserrat", "Noto Sans SC", sans-serif' }),
    makeSticker('ny-13', '新春快乐', '新春快乐', '#ffd1dc', '#5a1a3c'),
    makeSticker('ny-14', '福运来', '福运来', '#ffe6aa', '#4a2c12'),
    makeSticker('ny-15', '龙腾四海', '龙腾四海', '#f6d5ff', '#321d4f'),
    makeSticker('ny-16', '烟花绽放', '烟花绽放', '#c6f1ff', '#112d4e'),
    makeSticker('ny-17', '好运常在', '好运常在', '#ffeadb', '#5f2a2a'),
    makeSticker('ny-18', '举杯欢庆', '举杯欢庆', '#ffe6f7', '#472a63'),
    makeSticker('ny-19', '开门见喜', '开门见喜', '#fdd2af', '#4c2a1a'),
    makeSticker('ny-20', '福到你家', '福到你家', '#fff0d1', '#482121'),
    makeSticker('ny-21', '迎新纳福', '迎新纳福', '#e4f9f5', '#116466'),
    makeSticker('ny-22', '团圆时刻', '团圆时刻', '#ffe6cc', '#3d1f2b'),
    makeSticker('ny-23', 'Happy Spring', 'Happy Spring', '#d7ecff', '#112a46', { fontScale: 0.3 }),
    makeSticker('ny-24', 'Lucky Star', 'Lucky Star', '#fde2ff', '#311f53', { fontScale: 0.32 }),
    makeSticker('ny-25', '辞旧迎新', '辞旧迎新', '#f7fff6', '#1b4332'),
  ],
};

export function createStickers(elements, state, authState, ensureAuthenticated, cancelTextPlacement, announce) {
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
    if (!list.length) return;
    list.forEach((sticker) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sticker-button';
      button.dataset.stickerId = sticker.id;
      button.innerHTML = `<span class="sticker-glyph">${sticker.preview}</span><span>${sticker.label}</span>`;
      button.disabled = !authState.isAuthenticated;
      button.addEventListener('click', () => {
        if (!ensureAuthenticated()) return;
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
    if (state.mode !== 'sticker' && !state.selectedStickerId) return;
    state.mode = 'draw';
    state.selectedStickerId = null;
    updateStickerSelection();
    updateStickerMode(silent);
  }

  function getSelectedSticker() {
    const list = STICKER_LIBRARY[state.stickerCategory] ?? [];
    return list.find((s) => s.id === state.selectedStickerId) || null;
  }

  return {
    updateStickerCategory,
    renderStickerList,
    selectSticker,
    updateStickerSelection,
    updateStickerMode,
    exitStickerMode,
    getSelectedSticker,
  };
}

