import { app } from 'electron';
import { BrowserWindow } from 'electron/main';
import * as path from 'path';

const [MENU_WIN_W, MENU_WIN_H] = [350, 50];

app.on('ready', () => {
  createMenuWindow();
});

function createMenuWindow() {
  const menuWindow = new BrowserWindow({
    width: MENU_WIN_W,
    height: MENU_WIN_H,
    resizable: false,
    frame: false,
    show: false,
    webPreferences: {
      contextIsolation: true,
      //preload: path.join(__dirname, 'preload', 'menu.js'),
    },
  });

  menuWindow.loadFile(path.join('static', 'menu.html'));

  menuWindow.on('ready-to-show', () => {
    menuWindow.setPosition(900, 100);
    menuWindow.show();
  });
}
