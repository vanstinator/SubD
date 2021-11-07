import { spawn } from 'child_process';
import pathToFfmpeg from 'ffmpeg-static';
import { Readable } from 'stream';
import { getDesiredSampleRate } from 'core/services/speech/detect';

export default function extractAudio(inputFile: string): Readable {
  const sampleRate = getDesiredSampleRate();

  const child = spawn(pathToFfmpeg, [
    '-i',
    inputFile,
    '-hide_banner',
    '-loglevel',
    'error',
    '-ar',
    sampleRate.toString(),
    '-ac',
    '1',
    '-f',
    's16le',
    '-acodec',
    'pcm_s16le',
    'pipe:1'
  ]);
  let ffmpegOutput = '';
  child.stderr.on('data', (data: Buffer) => {
    ffmpegOutput += data.toString('utf-8');
  });
  child.on('exit', code => {
    if (code !== 0) {
      console.error(ffmpegOutput);
      throw new Error(`ffmpeg exited with code: ${code}`);
    }
  });
  return child.stdout;
}
