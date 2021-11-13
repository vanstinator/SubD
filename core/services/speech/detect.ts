import path from 'path';
import { Model, CandidateTranscript } from 'deepspeech';
import logger from 'electron-log';
import { Readable } from 'stream';
import { getModelPaths } from './download';
import createAudioStream, { getDuration } from './audio';

const log = logger.scope('detection');

const modelPaths = getModelPaths();
if (!modelPaths.model || !modelPaths.scorer) {
  throw new Error('Missing one or more required model files');
}
const model = new Model(modelPaths.model);
model.enableExternalScorer(modelPaths.scorer);

interface SpeechResult {
  text: { transcripts: CandidateTranscript[] };
  audioDuration: number;
}

export default async function detectSpeech(
  mediaPath: string,
  onProgress: (percent: number) => void
): Promise<SpeechResult> {
  const sampleRate = model.sampleRate();
  const audioDuration = await getDuration(mediaPath);
  log.info(`mediaPath: ${mediaPath}`);
  log.info(`audioDuration: ${audioDuration} ${sampleRate}`);
  const audioStream = createAudioStream(mediaPath, sampleRate);
  return new Promise((resolve, reject) => {
    let currentTime = 0;
    const modelStream = model.createStream();
    audioStream.on('data', chunk => {
      currentTime += (chunk.length / 2) * (1 / sampleRate);
      onProgress(currentTime / audioDuration);
      modelStream.feedAudioContent(chunk);
    });
    audioStream.on('close', () => {
      const text = modelStream.finishStreamWithMetadata();
      resolve({ text, audioDuration });
    });
  });
}
