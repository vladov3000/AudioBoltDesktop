import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronMenu", {
  hide: () => ipcRenderer.send("hide"),
  exit: () => ipcRenderer.send("exit"),
});
