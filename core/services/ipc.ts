import { ipcMain } from 'electron';
import logger from 'electron-log';
import queue from 'core/services/queue';
import { verifyModelFiles, downloadModelFiles, Downloader, DownloadProgress } from 'core/services/speech/download';

const log = logger.scope('ipc');

let activeDownloader: Downloader;

export default function ipcListeners() {
  ipcMain.on('analyze.start', (event, files: { movie: BasicFile; subtitle: BasicFile }) => {
    log.info('analyze.start', files);
    queue.queueMedia(files.movie, files.subtitle);
  });

  ipcMain.on('analyze.startupCheck', event => {
    const hasModelFiles = verifyModelFiles();
    event.reply('analyze.startupResult', { hasModelFiles });
  });
  ipcMain.on('analyze.download.start', event => {
    // start download
    activeDownloader = downloadModelFiles();
    activeDownloader.on('progress', progress => {
      event.reply('analyze.download.progress', progress);
    });
    activeDownloader.on('finish', () => {
      log.info('Download finished');
      event.reply('analyze.download.finished');
    });
    activeDownloader.on('error', error => {
      log.info('Download error', error);
      event.reply('analyze.download.error', error);
    });
    activeDownloader.start();
  });
  ipcMain.on('analyze.download.cancel', event => {
    log.info('Cancel download');
    activeDownloader.cancel();
  });
}
