import { BrowserWindow, ipcMain, app } from "electron";
import { Recorder } from "./record";
import { createSettingsWindow } from "./windows";

export function setupCommunication(
  menuWindow: BrowserWindow,
  subtitleWindow: BrowserWindow,
  recorder: Recorder
) {
  ipcMain.on("log", (_, source: string, text: string) => {
    console.log(`[${source}] ${text}`);
  });

  // Communcation with menu renderer
  ipcMain.on("start", () => {
    console.log("[menu] start");
    recorder.start();
  });

  ipcMain.on("stop", () => {
    console.log("[menu] stop");
    recorder.stop();
    if (config?.showTranscript) {
      console.log(recorder.allText);
    }
  });

  let settingsWindowCreated = false;
  ipcMain.on("settings", () => {
    console.log("[menu] settings");
    if (!settingsWindowCreated) {
      createSettingsWindow();
      settingsWindowCreated = true;
    }
  });

  ipcMain.on("hide", () => {
    console.log("[menu] hide");

    subtitleWindow.hide();
    menuWindow.hide();
  });

  ipcMain.on("exit", () => {
    console.log("[menu] exit");

    app.quit();
  });

  // Communication with subtitle renderer
  ipcMain.on("resize", (_, w: number, h: number) => {
    console.log(`[subtitle] resize to ${w} ${h}`);

    w = Math.floor(w);
    h = Math.floor(h);

    subtitleWindow.setSize(w, h);
  });

  // Communication with settings renderer
  let config: Config | null = null;
  ipcMain.on("config", (_, newConfig: Config) => {
    console.log("[settings] new config:");
    console.log(newConfig);
    config = newConfig;
  });
}

export function addSubtitle(subtitleWindow: BrowserWindow, subtitle: string) {
  if (!subtitleWindow.isVisible()) {
    subtitleWindow.showInactive();
  }
  subtitleWindow.webContents.send("newSubtitle", subtitle);
}
