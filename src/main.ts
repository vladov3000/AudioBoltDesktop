import { app } from "electron";
import {
  addSubtitle,
  setSubtitleFontSize,
  setupCommunication,
} from "./communications";
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
  setSubtitleFontSize(subtitleWindow, `${INIT_SUBTITLE_FONT_SIZE}px`);

  setupCommunication(menuWindow, subtitleWindow, recorder, config);
});
