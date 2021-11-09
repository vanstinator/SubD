import path from 'path';
import { Model } from 'deepspeech';
import { Readable } from 'stream';
import { getModelPaths } from './download';

const modelPaths = getModelPaths();
if (!modelPaths.model || !modelPaths.scorer) {
  throw new Error('Missing one or more required model files');
}
const model = new Model(modelPaths.model);
model.enableExternalScorer(modelPaths.scorer);

export function getDesiredSampleRate() {
  return model.sampleRate();
}

export default async function detectSpeech(audioStream: Readable) {
  return new Promise((resolve, reject) => {
    let duration = 0;
    const modelStream = model.createStream();
    audioStream.on('data', chunk => {
      duration += (chunk.length / 2) * (1 / getDesiredSampleRate());
      process.stdout.write(`processed ${duration} seconds\r`);
      modelStream.feedAudioContent(chunk);
    });
    audioStream.on('close', () => {
      process.stdout.write('\n');
      const text = modelStream.finishStreamWithMetadata();
      resolve({ text, duration });
    });
  });
}
