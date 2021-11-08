import { v4 as uuid } from 'uuid';

const MAX_SIZE = 100;

enum QUEUE_STATUS {
  COMPLETE = 'complete',
  ERROR = 'error',
  PROCESSING = 'processing',
  QUEUED = 'queued'
}

interface QueueItem {
  id: string;
  media: BasicFile;
  progress: number;
  status: QUEUE_STATUS;
  subtitle: BasicFile;
}

class JobQueue {
  queue: QueueItem[];

  constructor() {
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
  }
}

export default JobQueue;
