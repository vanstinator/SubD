import { ipcMain } from 'electron';
import queue from 'core/services/queue';

ipcMain.on('queue.get', event => {
  event.reply('queue.update', queue.queue);
});
