// these were exposed by the context bridge in the preload script
interface Window {
  electronMenu: {
    log: (text: string) => void;
    start: () => void;
    stop: () => void;
    hide: () => void;
    exit: () => void;
  };
}

window.onerror = (e) => {
  window.electronSubtitle.log(`Error: ${e}`);
};

const menuItemActions = {
  start: window.electronMenu.start,
  stop: window.electronMenu.stop,
  hide: window.electronMenu.hide,
  exit: window.electronMenu.exit,
};

window.onload = () => {
  const menuItemElements = document.querySelectorAll(
    "[class$=-menu-item]"
  ) as NodeListOf<HTMLDivElement>;

  let lastMousedown: MouseEvent | null = null;

  for (const menuItemElement of menuItemElements) {
    const menuItemName = menuItemElement.className.replace("-menu-item", "");

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
