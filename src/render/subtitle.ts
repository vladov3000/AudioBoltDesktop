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

const MAX_CHARS_PER_LINE = 30;
const MAX_LINES = 2;

window.onerror = (e) => {
  window.electronSubtitle.log(`Error: ${e}`);
};

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
  const lines = splitToFitMaxChars(subtitleElement.innerText + text);
  subtitleElement.innerText = lines.join();

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

function splitToFitMaxChars(
  text: string,
  maxCharsPerLine = MAX_CHARS_PER_LINE
) {
  if (text.length <= maxCharsPerLine) {
    return [text];
  }

  const lines = text
    .split("\n")
    .map((line) => {
      let res = [];

      while (line.length > maxCharsPerLine) {
        // find end of last word before max chars for length
        let end = maxCharsPerLine;
        while (!(line[end] != " " && line[end + 1] == " ")) {
          end--;
        }
        end += 2;

        // push small sentence to res
        res.push(line.slice(0, end));
        line = line.slice(end);
      }

      res.push(line);
      return res;
    })
    .flat();

  return lines;
}
