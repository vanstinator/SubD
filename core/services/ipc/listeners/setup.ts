import { ipcMain } from 'electron';
import logger from 'electron-log';
import { verifyModelFiles, downloadModelFiles, Downloader } from 'core/services/speech/download';

const log = logger.scope('ipc_analyze');

let downloader: Downloader;

ipcMain.on('setup.startupCheck', event => {
  const hasModelFiles = verifyModelFiles();
  event.reply('setup.startupResult', { hasModelFiles });
});

ipcMain.on('setup.download.start', event => {
  // start download
  downloader = downloadModelFiles();
  downloader.on('progress', progress => {
    event.reply('setup.download.progress', progress);
  });
  downloader.on('finish', () => {
    log.info('Download finished');
    event.reply('setup.download.finished');
  });
  downloader.on('error', error => {
    log.info('Download error', error);
    event.reply('setup.download.error', error);
  });
  downloader.start();
});

ipcMain.on('setup.download.cancel', event => {
  log.info('Cancel download');
  downloader.cancel();
});
