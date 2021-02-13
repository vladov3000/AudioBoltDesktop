import { create } from "domain";
import { app, ipcMain } from "electron";
import { BrowserWindow } from "electron/main";
import * as path from "path";

const [MENU_WIN_W, MENU_WIN_H] = [200, 50];
const INIT_SUBTITLE_FONT_SIZE = 50;

app.on("ready", () => {
  const menuWindow = createMenuWindow();
  const subtitleWindow = createSubtitleWindow();

  setupCommunication(menuWindow, subtitleWindow);
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
      preload: path.join(__dirname, "preload", "menu.js"),
    },
  });

  menuWindow.loadFile(path.join("static", "menu.html"));

  menuWindow.on("ready-to-show", () => {
    menuWindow.setPosition(900, 100);
    menuWindow.show();
  });

  // show menu window after hidden
  app.on("activate", () => {
    menuWindow.show();
  });

  return menuWindow;
}

function createSubtitleWindow() {
  const subtitleWindow = new BrowserWindow({
    width: 0,
    height: INIT_SUBTITLE_FONT_SIZE,
    resizable: false,
    alwaysOnTop: true,
    frame: false,
    show: false,
    focusable: false,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload", "subtitle.js"),
    },
  });

  subtitleWindow.loadFile(path.join("static", "subtitle.html"));

  subtitleWindow.on("ready-to-show", () => {
    if (!subtitleWindow) return;
    subtitleWindow.setPosition(500, 700);
  });

  // show subtitle window after hidden
  app.on("activate", () => {
    subtitleWindow.show();
  });

  return subtitleWindow;
}

function setupCommunication(
  menuWindow: BrowserWindow,
  subtitleWindow: BrowserWindow
) {
  ipcMain.on("log", (_, source: string, text: string) => {
    console.log(`[${source}] ${text}`);
  });

  // Communcation with menu renderer
  let count = 0;

  ipcMain.on("start", () => {
    if (!subtitleWindow.isVisible()) subtitleWindow.showInactive();
    subtitleWindow.webContents.send("newSubtitle", `hello world ${++count}.\n`);
    console.log("[menu] start");
  });

  ipcMain.on("stop", () => {
    console.log("[menu] stop");
  });

  ipcMain.on("hide", () => {
    subtitleWindow.hide();
    menuWindow.hide();
  });

  ipcMain.on("exit", () => {
    app.quit();
  });

  // Communication with subtitle renderer
  ipcMain.on("resize", (_, w: number, h: number) => {
    w = Math.floor(w);
    h = Math.floor(h);

    subtitleWindow.setSize(w, h);
  });
}
