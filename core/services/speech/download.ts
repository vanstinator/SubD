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
const TARGZ_REGEX = /\.tar\.gz$/;
const DOWNLOAD_ENDPOINT = 'https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/';

interface FileDownload {
  name: string;
  path: string;
  dirname?: string;
}
interface ModelPaths {
  model?: string;
  scorer?: string;
  audio?: string;
}
const FILES: FileDownload[] = [
  { name: 'model', path: 'deepspeech-0.9.3-models.pbmm' },
  { name: 'scorer', path: 'deepspeech-0.9.3-models.scorer' },
  { name: 'audio', dirname: 'audio', path: 'audio-0.9.3.tar.gz' }
];

export function verifyModelFiles() {
  const paths = getModelPaths();
  return Object.values(getModelPaths()).every(filepath => {
    return fs.existsSync(filepath);
  });
}

export function getModelPaths(): ModelPaths {
  return FILES.reduce((obj, file) => {
    const filename = file.dirname ? file.dirname : file.path;
    return {
      ...obj,
      [file.name]: path.join(APP_DIR, filename)
    };
  }, {});
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
    this.streamDownload(downloadUrl, localFile);
  }

  addPath(entry: any) {
    // TODO Use this function to track downloaded/extracted files in a DB, so we can manage or clean out them later
    // console.log(entry);
  }

  next() {
    if (this.progress.current + 1 < this.files.length) {
      this.progress.current++;
      this.start();
    } else {
      this.emit('finish');
    }
  }

  streamDownload(downloadUrl: string, localFile: string) {
    const isTarball = TARGZ_REGEX.test(downloadUrl);

    if (!isTarball && fs.existsSync(localFile)) {
      this.addPath(localFile);
      this.next();
      this.updateProgress();
      return;
    }

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
    if (isTarball) {
      fileWriterStream = tar.extract({
        cwd: APP_DIR,
        filter: entry => {
          return !/^\./.test(path.basename(entry));
        },
        onentry: entry => {
          this.addPath(path.join(APP_DIR, entry.path));
        }
      });
    } else {
      fileWriterStream = fs.createWriteStream(localFile);
    }
    fileWriterStream
      .on('error', error => {
        throw new Error(`Could not write file to system: ${error.message}`);
      })
      .on('finish', () => {
        this.addPath(localFile);
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
  return new Downloader(FILES.map(file => file.path));
}
