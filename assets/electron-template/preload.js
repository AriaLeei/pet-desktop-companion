const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('petAPI', {
  onState: (callback) => ipcRenderer.on('pet-state', (_event, value) => callback(value)),
  dragStart: (screenX, screenY) => ipcRenderer.send('drag-start', { screenX, screenY }),
  dragMove: (screenX, screenY) => ipcRenderer.send('drag-move', { screenX, screenY }),
  dragEnd: () => ipcRenderer.send('drag-end'),
});
