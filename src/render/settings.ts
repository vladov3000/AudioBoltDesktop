interface Config {
  showTranscript: boolean;
}

interface Window {
  electronSettings: {
    log: (text: string) => void;
    setConfig: (config: Config) => void;
  };
}

window.onerror = (e) => {
  window.electronSubtitle.log(`Error: ${e}`);
};

window.onload = () => {
  const config: Config = {
    showTranscript: false,
  };

  const showTranscriptCheckbox = document.getElementById(
    "show-transcript"
  ) as HTMLInputElement;
  if (!showTranscriptCheckbox) {
    return;
  }
  showTranscriptCheckbox.onchange = () => {
    config.showTranscript = showTranscriptCheckbox.checked;
    window.electronSettings.setConfig(config);
  };
};
