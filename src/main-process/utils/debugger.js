const { BrowserWindow, globalShortcut } = require('electron');
const isMac = () => {
  return process.platform === 'darwin';
}

const openDevTools = () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.openDevTools();
  }
}

const refresh = () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.webContents.reloadIgnoringCache();
  }
}

exports.initDebugger = () => {
  if (isMac) {
    // chrome dev tool
    globalShortcut.register('Command+Shift+O', () => {
      openDevTools();
    });
    // refresh
    globalShortcut.register('Command+R', () => {
      refresh();
    });
  } else {
    globalShortcut.register('Ctrl+Shift+O', () => {
      openDevTools();
    });
    globalShortcut.register('Ctrl+R', () => {
      refresh();
    });
  }
}