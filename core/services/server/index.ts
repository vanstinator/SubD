import express from 'express';
import logger from 'electron-log';

const PORT = process.env.PORT || 8337;
const log = logger.scope('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello world');
});

export default function createServer() {
  return new Promise((resolve, reject) => {
    app.listen(PORT, () => {
      log.info(`API Server listening at ${PORT}`);
      resolve(app);
    });
  });
}
