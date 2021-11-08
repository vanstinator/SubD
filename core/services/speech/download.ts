import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import got, { GotReturn } from 'got';
import tar from 'tar';
import logger from 'electron-log';
import EventEmitter from 'events';
import { Writable } from 'stream';

const log = logger.scope('ipc');

const APP_DIR = app.getPath('userData');

const DOWNLOAD_ENDPOINT = 'https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/';

const FILES = {
  models: 'deepspeech-0.9.3-models.pbmm',
  scorer: 'deepspeech-0.9.3-models.scorer',
  audio: 'audio-0.9.3.tar.gz'
};

export function verifyModelFiles() {
  return Object.values(FILES).every(file => {
    return fs.existsSync(path.join(APP_DIR, file));
  });
}

export interface DownloadProgress {
  progress: number;
  current: number;
  count: number;
}

export declare interface Downloader {
  on(event: 'progress', listener: (progress: DownloadProgress) => void): this;
  on(event: 'finish', listener: () => void): this;
  on(event: 'error', listener: (error: Error | { canceled: true }) => void): this;
}

export class Downloader extends EventEmitter {
  files: string[];
  progress: DownloadProgress;
  downloadStream?: GotReturn;
  lastUpdate: number;

  constructor(files: string[]) {
    super();
    this.files = files;
    this.progress = {
      progress: 0,
      current: 0,
      count: Object.values(FILES).length
    };
    this.lastUpdate = 0;
  }
  async start() {
    const file = this.files[this.progress.current];
    this.progress.progress = 0;
    this.updateProgress();
    const localFile = path.join(APP_DIR, file);
    const downloadUrl = `${DOWNLOAD_ENDPOINT}${file}`;
    log.info(`Downloading: ${downloadUrl} to:\n ${localFile}`);
    this.streamDownload(downloadUrl, localFile);
  }
  next() {
    if (this.progress.current + 1 < this.files.length) {
      this.progress.current++;
      this.start();
    } else {
      console.log('all done');
      this.emit('finish');
    }
  }

  streamDownload(downloadUrl: string, localFile: string) {
    this.downloadStream = got.stream(downloadUrl);

    this.downloadStream
      .on(
        'downloadProgress',
        ({ transferred, total, percent }: { transferred: number; total: number; percent: number }) => {
          this.progress.progress = percent * 100;
          this.updateProgress(true);
        }
      )
      .on('error', (error: Error) => {
        throw new Error(`Download failed: ${error.message}`);
      });

    let fileWriterStream: Writable;
    if (/tar\.gz$/.test(downloadUrl)) {
      const { name, dir } = path.parse(localFile);
      const folder = path.join(dir, name);
      log.info(`folder: ${folder}`);
      log.info(`APP_DIR: ${APP_DIR}`);
      fileWriterStream = tar.extract({ cwd: APP_DIR });
    } else {
      fileWriterStream = fs.createWriteStream(localFile);
    }
    fileWriterStream
      .on('error', error => {
        throw new Error(`Could not write file to system: ${error.message}`);
      })
      .on('finish', () => {
        console.log(`File downloaded to ${localFile}`);
        this.next();
        this.updateProgress();
      });
    this.downloadStream.pipe(fileWriterStream);
  }
  updateProgress(limit = false) {
    if (limit && this.lastUpdate > Date.now() - 250) {
      return;
    }
    this.lastUpdate = Date.now();
    this.emit('progress', this.progress);
  }
  cancel() {
    // @ts-ignore Not sure I have the correct type on this stream
    this.downloadStream.destroy();
    this.emit('error', { canceled: true });
  }
}

export function downloadModelFiles(): Downloader {
  return new Downloader(Object.values(FILES));
}
