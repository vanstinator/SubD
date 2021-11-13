import { webContents } from 'electron';

export default function broadcastMessage(eventName: string, ...args: any) {
  webContents.getAllWebContents().forEach(wc => {
    wc.send(eventName, ...args);
  });
}
