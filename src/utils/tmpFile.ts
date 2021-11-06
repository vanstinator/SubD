import { tmpdir } from 'os';
import path from 'path';

function tmpName() {
  return Date.now().toString(16) + Math.round(Math.random() * 10e4).toString(16);
}

export default function tmpFile({ extension, prefix = '' }: { extension: string; prefix?: string }): string {
  return path.join(tmpdir(), prefix + tmpName() + extension);
}
