import path from 'path';
import { Model } from 'deepspeech';
import { Readable } from 'stream';

const MODEL_PATH = path.resolve('./data/deepspeech-0.9.3-models.pbmm');
const SCORER_PATH = path.resolve('./data/deepspeech-0.9.3-models.scorer');

const model = new Model(MODEL_PATH);
model.enableExternalScorer(SCORER_PATH);

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
