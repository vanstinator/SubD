import express from 'express';
import queue from 'core/services/queue';

const app = express();
app.get('/', (req, res) => {
  res.json(queue.queue);
});
export default app;
