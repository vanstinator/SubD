import express from 'express';
import queue from 'core/services/queue';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json(queue.queue);
});

app.post('/', (req, res) => {
  const { movie, subtitle } = req.body;
  queue.queueMedia(movie, subtitle);
});

export default app;
