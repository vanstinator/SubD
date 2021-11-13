import { v4 as uuid } from 'uuid';
import logger from 'electron-log';
import broadcastMessage from 'core/services/ipc/broadcast';
import analyzeJob from './jobs/analyze';

const log = logger.scope('queue');

const MAX_SIZE = 10;

enum QUEUE_STATUS {
  COMPLETE = 'complete',
  ERROR = 'error',
  PROCESSING = 'processing',
  QUEUED = 'queued'
}

interface QueueItem {
  data?: any;
  id: string;
  media: BasicFile;
  progress: number;
  status: QUEUE_STATUS;
  error?: string;
  subtitle: BasicFile;
}

class JobQueue {
  activeIndex: number;
  queue: QueueItem[];

  constructor() {
    this.activeIndex = -1;
    this.queue = [];
  }

  queueMedia(media: BasicFile, subtitle: BasicFile) {
    if (this.queue.length >= MAX_SIZE) {
      this.queue.splice(0, this.queue.length - MAX_SIZE + 1);
    }
    this.queue.push({
      id: uuid(),
      media,
      subtitle,
      progress: 0,
      status: QUEUE_STATUS.QUEUED
    });

    this.postUpdate();

    if (this.activeIndex < 0) {
      this.start();
    }
  }

  postUpdate() {
    broadcastMessage('queue.update', this.queue);
  }

  async start() {
    this.activeIndex = this.queue.findIndex(item => item.status === QUEUE_STATUS.QUEUED);
    log.debug('this.activeIndex', this.activeIndex);
    if (this.activeIndex < 0) {
      log.warn('No jobs in queue');
      return;
    }
    const activeItem = this.queue[this.activeIndex];
    activeItem.status = QUEUE_STATUS.PROCESSING;
    this.postUpdate();

    try {
      await this.runJob();
      activeItem.status = QUEUE_STATUS.COMPLETE;
      activeItem.progress = 1;
      this.postUpdate();
    } catch (error) {
      activeItem.status = QUEUE_STATUS.ERROR;
    }
    this.postUpdate();
  }

  async runJob() {
    // TODO: Edit this to allow for other types of jobs?
    this.queue[this.activeIndex].data = await analyzeJob(
      this.queue[this.activeIndex].media.path,
      this.queue[this.activeIndex].subtitle.path,
      percent => {
        this.queue[this.activeIndex].progress = percent;
        this.postUpdate();
      }
    );
  }
}

export default JobQueue;
