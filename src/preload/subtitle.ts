import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronSubtitle", {
  log: (text: string) => ipcRenderer.send("log", "subtitle", text),
  resize: (w: number, h: number) => ipcRenderer.send("resize", w, h),
  onNewSubtitle: (
    callback: (e: Electron.IpcRendererEvent, text: string) => void
  ) => ipcRenderer.on("newSubtitle", callback),
});
