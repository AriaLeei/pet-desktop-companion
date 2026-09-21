const { app, BrowserWindow, Menu, Tray, ipcMain, nativeImage, screen } = require('electron');
const path = require('path');

let window;
let tray;
let dragState = null;
let lastInteractionAt = Date.now();
let lastMousePoint = null;
let lastPetState = '';
let curiosityUntil = 0;
const WIDTH = 190;
const HEIGHT = 190;

function visibleBounds() {
  const point = window ? window.getBounds() : { x: 0, y: 0 };
  return screen.getDisplayNearestPoint(point).workArea;
}

function summon() {
  const area = screen.getPrimaryDisplay().workArea;
  window.show();
  window.setPosition(area.x + area.width - WIDTH - 32, area.y + area.height - HEIGHT - 10);
}

function setPetState(state, tilt = 'center') {
  const key = `${state}:${tilt}`;
  if (!window || window.isDestroyed() || key === lastPetState) return;
  lastPetState = key;
  window.webContents.send('pet-state', { state, tilt });
}

function createTray() {
  const source = path.join(__dirname, 'assets', 'sit', 'center.png');
  const icon = nativeImage.createFromPath(source).resize({ width: 18, height: 18 });
  icon.setTemplateImage(true);
  tray = new Tray(icon);
  tray.setToolTip('宠物桌面伙伴');
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: '召唤到右下角', click: summon },
    { label: '收起宠物', click: () => window.hide() },
    { type: 'separator' },
    { label: '彻底退出', click: () => app.quit() },
  ]));
  tray.on('click', summon);
}

function createWindow() {
  window = new BrowserWindow({
    width: WIDTH,
    height: HEIGHT,
    transparent: true,
    frame: false,
    resizable: false,
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  window.setAlwaysOnTop(true, 'floating');
  window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  window.loadFile('index.html');
  summon();
  window.webContents.once('did-finish-load', () => setPetState('walk'));
  window.webContents.on('context-menu', () => {
    Menu.buildFromTemplate([
      { label: '回到右下角', click: summon },
      { label: '收起宠物', click: () => window.hide() },
    ]).popup({ window });
  });
}

ipcMain.on('drag-start', (_event, point) => {
  const bounds = window.getBounds();
  dragState = { cursorX: point.screenX, cursorY: point.screenY, windowX: bounds.x, windowY: bounds.y };
  lastInteractionAt = Date.now();
  setPetState('walk');
});

ipcMain.on('drag-move', (_event, point) => {
  if (!dragState) return;
  const area = visibleBounds();
  const x = dragState.windowX + point.screenX - dragState.cursorX;
  const y = dragState.windowY + point.screenY - dragState.cursorY;
  window.setPosition(
    Math.round(Math.max(area.x, Math.min(area.x + area.width - WIDTH, x))),
    Math.round(Math.max(area.y, Math.min(area.y + area.height - HEIGHT, y))),
  );
  lastInteractionAt = Date.now();
});

ipcMain.on('drag-end', () => {
  dragState = null;
  lastInteractionAt = Date.now();
});

function watchInteraction() {
  const now = Date.now();
  const cursor = screen.getCursorScreenPoint();
  const bounds = window.getBounds();
  const near = cursor.x >= bounds.x - 90 && cursor.x <= bounds.x + bounds.width + 90
    && cursor.y >= bounds.y - 90 && cursor.y <= bounds.y + bounds.height + 70;
  if (lastMousePoint && near && !dragState) {
    const dx = cursor.x - lastMousePoint.x;
    const dy = cursor.y - lastMousePoint.y;
    if (Math.abs(dx) + Math.abs(dy) >= 3) {
      lastInteractionAt = now;
      if (Math.abs(dx) >= 2) {
        curiosityUntil = now + 850;
        setPetState('curious', cursor.x < bounds.x + bounds.width / 2 ? 'left' : 'right');
      }
    }
  }
  lastMousePoint = cursor;
  if (dragState || now < curiosityUntil) return;
  setPetState(now - lastInteractionAt >= 10000 ? 'sit' : 'walk');
}

const singleInstance = app.requestSingleInstanceLock();
if (!singleInstance) app.quit();
app.on('second-instance', () => { if (window) summon(); });
app.whenReady().then(() => {
  if (process.platform === 'darwin' && app.dock) app.dock.hide();
  createWindow();
  createTray();
  setInterval(watchInteraction, 50);
});
app.on('window-all-closed', (event) => event.preventDefault());
