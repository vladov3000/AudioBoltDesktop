import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronMenu", {
  log: (text: string) => ipcRenderer.send("log", "menu", text),
  start: () => ipcRenderer.send("start"),
  stop: () => ipcRenderer.send("stop"),
  settings: () => ipcRenderer.send("settings"),
  hide: () => ipcRenderer.send("hide"),
  exit: () => ipcRenderer.send("exit"),
});
