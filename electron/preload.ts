import { contextBridge, ipcRenderer } from 'electron';

export const api = {
  addIpcListener: (eventName: string, eventListener: (...args: any[]) => void) => {
    ipcRenderer.on(eventName, eventListener);
  },
  removeIpcListener: (eventName: string, eventListener: (...args: any[]) => void) => {
    ipcRenderer.off(eventName, eventListener);
  },
  ipcSend: (eventName: string, eventData: any) => {
    ipcRenderer.send(eventName, eventData);
  }
};

contextBridge.exposeInMainWorld('api', api);
