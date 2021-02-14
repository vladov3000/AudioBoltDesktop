import { app } from "electron";
import { addSubtitle, setupCommunication } from "./communications";
import { Recorder } from "./record";
import { createMenuWindow, createSubtitleWindow } from "./windows";

app.on("ready", () => {
  const menuWindow = createMenuWindow();
  const subtitleWindow = createSubtitleWindow();
  const recorder = new Recorder((text) => addSubtitle(subtitleWindow, text));
  const config: Config = {
    showTranscript: false,
  };

  setupCommunication(menuWindow, subtitleWindow, recorder, config);
});
