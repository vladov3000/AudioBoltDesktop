import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronTranscript", {
  log: (text: string) => ipcRenderer.send("log", "transcript", text),
  onTranscript: (
    callback: (e: Electron.IpcRendererEvent, transcript: string) => void
  ) => ipcRenderer.on("transcript", callback),
});
