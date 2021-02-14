import { BrowserWindow, ipcMain, app } from "electron";
import { Recorder } from "./record";
import {
  createSettingsWindow,
  createTranscriptWindow,
  INIT_SUBTITLE_FONT_SIZE,
} from "./windows";

export function setupCommunication(
  menuWindow: BrowserWindow,
  subtitleWindow: BrowserWindow,
  recorder: Recorder,
  config: Config
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
    subtitleWindow.setSize(0, INIT_SUBTITLE_FONT_SIZE);

    if (config.showTranscript && recorder.allText) {
      console.log("all text from recorder:");
      console.log(recorder.allText);

      const transcriptWindow = createTranscriptWindow();
      transcriptWindow.on("ready-to-show", () => {
        writeTranscript(transcriptWindow, recorder.allText);
      });
    }
  });

  let settingsWindowCreated = false;
  ipcMain.on("settings", () => {
    console.log("[menu] settings");

    if (!settingsWindowCreated) {
      const settingsWindow = createSettingsWindow();
      setInitConfig(settingsWindow, config);

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
  ipcMain.on("config", (_, newConfig: Config) => {
    console.log("[settings] new config:");
    console.log(newConfig);

    config = newConfig;
    subtitleWindow.setSize(subtitleWindow.getSize[0], config.subtitleFontSize);
  });
}

export function addSubtitle(subtitleWindow: BrowserWindow, subtitle: string) {
  if (!subtitleWindow.isVisible()) {
    subtitleWindow.showInactive();
  }
  subtitleWindow.webContents.send("newSubtitle", subtitle);
}

function writeTranscript(transcriptWindow: BrowserWindow, transcript: string) {
  transcriptWindow.webContents.send("transcript", transcript);
}

function setInitConfig(settingsWindow: BrowserWindow, config: Config) {
  settingsWindow.webContents.on("did-finish-load", () =>
    settingsWindow.webContents.send("initconfig", JSON.stringify(config))
  );
}
