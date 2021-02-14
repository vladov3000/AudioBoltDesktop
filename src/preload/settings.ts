import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronSettings", {
  log: (text: string) => ipcRenderer.send("log", "settings", text),
  setConfig: (config: Config) => ipcRenderer.send("config", config),
});
