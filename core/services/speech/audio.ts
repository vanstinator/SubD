import { exec, spawn } from 'child_process';
import pathToFfmpeg from 'ffmpeg-static';
import { Readable } from 'stream';

const DURATION_REGEX = /Duration:\s(\d{2}):(\d{2}):([\d.]+)/;

console.log(pathToFfmpeg);

export function getDuration(inputFile: string): Promise<number> {
  return new Promise((resolve, reject) => {
    exec(`"${pathToFfmpeg}" -hide_banner -i "${inputFile}"`, (error, stdout, stderr) => {
      const matches = stderr.match(DURATION_REGEX);
      if (matches?.length === 4) {
        const [, hours, minutes, seconds] = matches;
        const duration = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60 + parseFloat(seconds);
        return resolve(duration);
      }
      reject('Could not determine media duration');
    });
  });
}

export default function extractAudio(inputFile: string, sampleRate: number): Readable {
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
