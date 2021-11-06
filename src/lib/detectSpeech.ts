import path from 'path';
import { Metadata, Model } from 'deepspeech';
import { Readable } from 'stream';
import { AudioResult } from './extractAudio';

const MODEL_PATH = path.resolve('./data/deepspeech-0.9.3-models.pbmm');
const SCORER_PATH = path.resolve('./data/deepspeech-0.9.3-models.scorer');

const model = new Model(MODEL_PATH);
model.enableExternalScorer(SCORER_PATH);

export function getDesiredSampleRate() {
  return model.sampleRate();
}

export default async function detectSpeech({ duration, stream: audioStream }: AudioResult): Promise<Metadata> {
  return new Promise((resolve, reject) => {
    let secondsProcessed = 0;
    const modelStream = model.createStream();
    audioStream.on('data', chunk => {
      secondsProcessed += (chunk.length / 2) * (1 / getDesiredSampleRate());
      const progress = (secondsProcessed / duration) * 100;
      process.stdout.write(
        [
          `${progress.toFixed(1).padStart(5, ' ')}%`,
          `processed ${Math.floor(secondsProcessed)} of ${duration} seconds\r`
        ].join(' - ')
      );
      modelStream.feedAudioContent(chunk);
    });
    audioStream.on('close', () => {
      process.stdout.write('\n');
      resolve(modelStream.finishStreamWithMetadata());
    });
  });
}
