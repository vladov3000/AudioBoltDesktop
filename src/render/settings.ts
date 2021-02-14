interface Config {
  showTranscript: boolean;
  subtitleFontSize: number;
}

interface Window {
  electronSettings: {
    log: (text: string) => void;
    setConfig: (config: Config) => void;
    onInitConfig: (
      callback: (e: Electron.IpcRendererEvent, configStr: string) => void
    ) => void;
  };
}

window.onerror = (e) => {
  window.electronSubtitle.log(`Error: ${e}`);
};

window.electronSettings.onInitConfig((_, configStr) => {
  const config: Config = JSON.parse(configStr);

  const showTranscriptCheckbox = document.getElementById(
    "show-transcript"
  ) as HTMLInputElement;

  if (!showTranscriptCheckbox) {
    window.electronSettings.log("Could not find transcript checkbox");
    return;
  }

  showTranscriptCheckbox.onchange = () => {
    config.showTranscript = showTranscriptCheckbox.checked;
    window.electronSettings.setConfig(config);
  };

  const subtitleFontSizeInput = document.getElementById(
    "subtitle-font-size"
  ) as HTMLInputElement;

  if (!subtitleFontSizeInput) {
    window.electronSettings.log(
      "Could not find subtitle font size number input"
    );
    return;
  }

  subtitleFontSizeInput.value = config.subtitleFontSize.toString();
  subtitleFontSizeInput.onchange = () => {
    config.subtitleFontSize = +subtitleFontSizeInput.value;
    window.electronSettings.setConfig(config);
  };
});
