import { contextBridge, ipcRenderer } from 'electron';

export const api = {
  addIpcListener: (eventName: string, eventListener: (...args: any[]) => void) => {
    ipcRenderer.on(eventName, eventListener);
  },
  removeIpcListener: (eventName: string, eventListener: (...args: any[]) => void) => {
    ipcRenderer.off(eventName, eventListener);
  },
  ipcSend: (eventName: string, ...args: any[]) => {
    ipcRenderer.send(eventName, ...args);
  }
};

contextBridge.exposeInMainWorld('api', api);
