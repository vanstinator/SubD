import { v4 as uuid } from 'uuid';

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
