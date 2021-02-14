import { BrowserWindow, app } from "electron";
import * as path from "path";

const [MENU_WIN_W, MENU_WIN_H] = [250, 50];
const INIT_SUBTITLE_FONT_SIZE = 50;
const [SETTINGS_WIN_W, SETTINGS_WIN_H] = [450, 450];

export function createMenuWindow() {
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

  app.on("activate", () => {
    menuWindow.show();
  });

  return menuWindow;
}

export function createSubtitleWindow() {
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
    subtitleWindow.setPosition(500, 700);
  });

  app.on("activate", () => {
    subtitleWindow.show();
  });

  return subtitleWindow;
}

export function createSettingsWindow() {
  const settingsWindow = new BrowserWindow({
    width: SETTINGS_WIN_W,
    height: SETTINGS_WIN_H,
    resizable: false,
    frame: false,
    show: false,
    titleBarStyle: "hidden",
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload", "settings.js"),
    },
  });

  settingsWindow.loadFile(path.join("static", "settings.html"));

  settingsWindow.on("ready-to-show", () => {
    settingsWindow.show();
  });

  app.on("activate", () => {
    settingsWindow.show();
  });
}
