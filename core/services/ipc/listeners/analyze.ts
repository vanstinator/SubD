import { ipcMain } from 'electron';
import logger from 'electron-log';
import queue from 'core/services/queue';

const log = logger.scope('ipc_analyze');

ipcMain.on('analyze.start', (event, files: { movie: BasicFile; subtitle: BasicFile }) => {
  log.info('analyze.start', files);
  queue.queueMedia(files.movie, files.subtitle);
});
