// these were exposed by the context bridge in the preload script
interface Window {
  electronTranscript: {
    log: (text: string) => void;
    onTranscript: (
      callback: (e: Electron.IpcRendererEvent, transcript: string) => void
    ) => void;
  };
}

window.electronTranscript.onTranscript((_, transcript) => {
  const transcriptElement = document.getElementById("transcript");
  if (!transcriptElement) {
    window.electronTranscript.log("couldn't find transcript element");
    return;
  }

  transcriptElement.innerText = transcript;
});
