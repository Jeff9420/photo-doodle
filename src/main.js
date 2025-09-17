const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 720;
const MAX_HISTORY = 25;

const state = {
  tool: 'starHeart',
  color: '#ff4b6e',
  size: 20,
  isDrawing: false,
  hasPhoto: false,
  cameraStream: null,
  cameraReady: false,
  lastPoint: null,
  lastStampPoint: null,
  shapeToggle: true,
};

const elements = {
  video: document.getElementById('cameraPreview'),
  status: document.getElementById('cameraStatus'),
  overlay: document.getElementById('cameraOverlay'),
  startCamera: document.getElementById('startCamera'),
  capturePhoto: document.getElementById('capturePhoto'),
  stopCamera: document.getElementById('stopCamera'),
  uploadInput: document.getElementById('uploadInput'),
  toolSelect: document.getElementById('toolSelect'),
  colorPicker: document.getElementById('colorPicker'),
  sizeSlider: document.getElementById('sizeSlider'),
  undoButton: document.getElementById('undoDoodle'),
  clearButton: document.getElementById('clearDoodle'),
  exportButton: document.getElementById('exportImage'),
  canvasPlaceholder: document.getElementById('canvasPlaceholder'),
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
  updatePlaceholder();
  updateCameraControls();
  announce('正在等待摄像头权限或手动启动。');
  if (isCameraSupported()) {
    // 主动尝试启动，失败时提示用户点击按钮重试。
    startCamera().catch(() => {
      // 忽略异常，界面状态已在 startCamera 内部处理。
    });
  } else {
    disableCameraControls();
    announce('当前浏览器暂不支持摄像头访问，可直接上传图片继续创作。');
  }
}

function configureCanvases() {
  photoCanvas.width = CANVAS_WIDTH;
  photoCanvas.height = CANVAS_HEIGHT;
  doodleCanvas.width = CANVAS_WIDTH;
  doodleCanvas.height = CANVAS_HEIGHT;
  canvasRect = doodleCanvas.getBoundingClientRect();
  window.addEventListener('resize', () => {
    canvasRect = doodleCanvas.getBoundingClientRect();
  });
  clearCanvas(photoCtx, '#ffffff');
  clearCanvas(doodleCtx);
}

function bindEvents() {
  elements.startCamera.addEventListener('click', () => {
    startCamera().catch(() => {
      /* 已在 startCamera 中提示用户 */
    });
  });
  elements.stopCamera.addEventListener('click', stopCamera);
  elements.capturePhoto.addEventListener('click', capturePhoto);
  elements.uploadInput.addEventListener('change', handleUpload);
  elements.toolSelect.addEventListener('change', (event) => {
    state.tool = event.target.value;
  });
  elements.colorPicker.addEventListener('input', (event) => {
    state.color = event.target.value;
  });
  elements.sizeSlider.addEventListener('input', (event) => {
    const value = Number(event.target.value);
    state.size = value;
    event.target.setAttribute('aria-valuenow', String(value));
  });
  elements.undoButton.addEventListener('click', undoDoodle);
  elements.clearButton.addEventListener('click', clearDoodle);
  elements.exportButton.addEventListener('click', exportImage);

  doodleCanvas.addEventListener('pointerdown', startDrawing);
  doodleCanvas.addEventListener('pointermove', continueDrawing);
  doodleCanvas.addEventListener('pointerup', finishDrawing);
  doodleCanvas.addEventListener('pointerleave', finishDrawing);
  doodleCanvas.addEventListener('pointercancel', finishDrawing);

  window.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
      event.preventDefault();
      undoDoodle();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopCamera();
    }
  });
}

function isCameraSupported() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

function disableCameraControls() {
  elements.startCamera.disabled = true;
  elements.capturePhoto.disabled = true;
  elements.stopCamera.disabled = true;
}

function updateCameraControls() {
  const active = Boolean(state.cameraStream);
  elements.startCamera.disabled = active;
  elements.stopCamera.disabled = !active;
  elements.capturePhoto.disabled = !state.cameraReady;
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
        width: { ideal: 1280 },
        height: { ideal: 720 },
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
  announce('已捕捉当前画面，快来绘制你的星心祝福吧！');
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
      announce('图片已载入，星星与爱心正在等待你的创意。');
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

function startDrawing(event) {
  if (!state.hasPhoto) {
    highlightPlaceholder();
    return;
  }
  if (event.isPrimary === false && event.pointerType !== 'mouse') {
    return;
  }
  event.preventDefault();
  state.isDrawing = true;
  state.shapeToggle = true;
  state.lastPoint = getCanvasCoordinates(event);
  state.lastStampPoint = { ...state.lastPoint };
  pushHistory();
  try {
    doodleCanvas.setPointerCapture(event.pointerId);
  } catch (error) {
    // 某些浏览器在多指触控时可能不支持 Pointer Capture，可忽略。
  }

  if (state.tool === 'freehand') {
    drawLineSegment(state.lastPoint, state.lastPoint);
  } else {
    stampStarHeart(state.lastPoint, true);
  }
}

function continueDrawing(event) {
  if (!state.isDrawing) {
    return;
  }
  if (event.isPrimary === false && event.pointerType !== 'mouse') {
    return;
  }
  event.preventDefault();
  const point = getCanvasCoordinates(event);
  if (state.tool === 'freehand') {
    drawLineSegment(state.lastPoint, point);
    state.lastPoint = point;
  } else {
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
  }
}

function finishDrawing(event) {
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
    // 忽略 Pointer Capture 释放异常。
  }
}

function drawLineSegment(from, to) {
  doodleCtx.save();
  doodleCtx.lineCap = 'round';
  doodleCtx.lineJoin = 'round';
  doodleCtx.strokeStyle = state.color;
  doodleCtx.lineWidth = state.size;
  doodleCtx.beginPath();
  doodleCtx.moveTo(from.x, from.y);
  doodleCtx.lineTo(to.x, to.y);
  doodleCtx.stroke();
  doodleCtx.restore();
}

function stampStarHeart(point, forceStar = false) {
  const baseSize = Math.max(6, state.size);
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

function undoDoodle() {
  if (!doodleHistory.length) {
    announce('没有可撤销的笔画，继续创作吧！');
    return;
  }
  const snapshot = doodleHistory.pop();
  doodleCtx.putImageData(snapshot, 0, 0);
  announce('已撤销上一笔涂鸦。');
}

function clearDoodle() {
  if (!state.hasPhoto && doodleHistory.length === 0) {
    return;
  }
  pushHistory();
  clearCanvas(doodleCtx);
  announce('画布已清空，可以重新开始绘制。');
}

function resetDoodleCanvas() {
  doodleHistory.length = 0;
  clearCanvas(doodleCtx);
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

init();
