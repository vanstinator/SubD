import { v4 as uuid } from 'uuid';

enum QUEUE_STATUS {
  COMPLETE = 'complete',
  ERROR = 'error',
  PROCESSING = 'processing',
  QUEUED = 'queued'
}

interface QueueItem {
  id: string;
  media: string;
  progress: number;
  status: QUEUE_STATUS;
  subtitle: string;
}

class AnalysisQueue {
  queue: QueueItem[];

  constructor() {
    this.queue = [];
  }

  queueMedia(media: string, subtitle: string) {
    this.queue.push({
      id: uuid(),
      media,
      subtitle,
      progress: 0,
      status: QUEUE_STATUS.QUEUED
    });
  }
}

export default AnalysisQueue;
