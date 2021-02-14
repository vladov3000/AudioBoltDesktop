import { app } from "electron";
import { addSubtitle, setupCommunication } from "./communications";
import { Recorder } from "./record";
import {
  createMenuWindow,
  createSubtitleWindow,
  INIT_SUBTITLE_FONT_SIZE,
} from "./windows";

app.on("ready", () => {
  const menuWindow = createMenuWindow();
  const subtitleWindow = createSubtitleWindow();
  const recorder = new Recorder((text) => addSubtitle(subtitleWindow, text));
  const config: Config = {
    showTranscript: false,
    subtitleFontSize: INIT_SUBTITLE_FONT_SIZE,
  };

  setupCommunication(menuWindow, subtitleWindow, recorder, config);
});
