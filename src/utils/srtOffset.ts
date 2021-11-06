import fs from 'fs';
import { parseSync, stringifySync } from 'subtitle';

export default function srtOffset(inputFile: string, offset = 0) {
  const raw = fs.readFileSync(inputFile, 'utf-8');
  const data = parseSync(raw);
  const remapped = data.map(cue => {
    if (cue.type === 'cue') {
      cue.data.start += offset * 1000;
      cue.data.end += offset * 1000;
    }
    return cue;
  });
  console.log(data);
  return stringifySync(remapped, { format: 'SRT' });
}
