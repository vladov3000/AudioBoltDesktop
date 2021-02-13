// these were exposed by the context bridge in the preload script
interface Window {
  electronSubtitle: {
    log: (text: string) => void;
    resize: (w: number, h: number) => void;
    onNewSubtitle: (
      callback: (e: Electron.IpcRendererEvent, text: string) => void
    ) => void;
  };
}

const log = window.electronSubtitle.log;

window.onerror = (e) => {
  log(`Error: ${e}`);
};

const MAX_LINES = 2;

window.onload = () => {
  const subtitleElement = document.getElementById(
    "subtitle"
  ) as HTMLSpanElement;
  subtitleElement.style.fontSize = `50px`;

  window.electronSubtitle.onNewSubtitle((_, text) => {
    addText(subtitleElement, text);
    updateWindowSize(subtitleElement);
  });
};

function addText(subtitleElement: HTMLSpanElement, text: string) {
  subtitleElement.innerText += text;

  let lines = subtitleElement.innerText.split("\n");

  let delta = lines.length - 1 - MAX_LINES;
  if (delta > 0) {
    lines.splice(0, delta);
  }

  subtitleElement.innerText = lines.join("\n");
}

function updateWindowSize(subtitleElement: HTMLSpanElement) {
  let w = subtitleElement.offsetWidth;
  let h = subtitleElement.offsetHeight;

  window.electronSubtitle.resize(w, h);

  document.body.style.width = `${w}px`;
  document.body.style.height = `${h}px`;
}
