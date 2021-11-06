import { execSync, spawn } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import ffprobe from 'ffprobe-static';
import { Readable } from 'stream';
import { getDesiredSampleRate } from 'lib/detectSpeech';

function getInputDuration(inputFile: string) {
  const result = execSync(
    `"${ffprobe.path}" -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${inputFile}"`
  ).toString();
  return result ? parseFloat(result) : -1;
}

export interface AudioResult {
  duration: number;
  stream: Readable;
}

export default function extractAudio(inputFile: string): AudioResult {
  const sampleRate = getDesiredSampleRate();
  const duration = getInputDuration(inputFile);
  const child = spawn(ffmpeg, [
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
  return { duration, stream: child.stdout };
}
