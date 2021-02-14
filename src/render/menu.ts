// these were exposed by the context bridge in the preload script
interface Window {
  electronMenu: {
    log: (text: string) => void;
    start: () => void;
    stop: () => void;
    settings: () => void;
    hide: () => void;
    exit: () => void;
  };
}

window.onerror = (e) => {
  window.electronSubtitle.log(`Error: ${e}`);
};

window.onload = () => {
  const menuItemElementsList = document.querySelectorAll(
    "[class$=-menu-item]"
  ) as NodeListOf<HTMLDivElement>;

  let lastMousedown: MouseEvent | null = null;

  const menuItemElements: { string?: HTMLDivElement } = {};

  function toggleStartStopElements() {
    const startElement = menuItemElements["start"] as
      | HTMLDivElement
      | undefined;
    const stopElement = menuItemElements["stop"] as HTMLDivElement | undefined;

    if (!startElement) {
      window.electronMenu.log("could not find start element");
      return;
    }
    if (!stopElement) {
      window.electronMenu.log("could not find stop element");
      return;
    }
    startElement.hidden = !startElement?.hidden;
    stopElement.hidden = !stopElement?.hidden;
  }

  const menuItemActions = {
    start: () => {
      toggleStartStopElements();
      window.electronMenu.start();
    },
    stop: () => {
      toggleStartStopElements();
      window.electronMenu.stop;
    },
    settings: window.electronMenu.settings,
    hide: window.electronMenu.hide,
    exit: window.electronMenu.exit,
  };

  for (const menuItemElement of menuItemElementsList) {
    const menuItemName = menuItemElement.className.replace("-menu-item", "");
    menuItemElements[menuItemName] = menuItemElement;

    menuItemElement.addEventListener("mousedown", (e) => {
      lastMousedown = e;
    });

    menuItemElement.addEventListener("mouseup", (e) => {
      if (lastMousedown == null) {
        return;
      }
      if (Math.abs(e.x - lastMousedown.x + e.y - lastMousedown.y) > 0) {
        // a drag of the window, not a click occured
        return;
      }

      menuItemActions[menuItemName]();
    });
  }
};
