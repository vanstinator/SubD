import fs from 'fs';
import { parse, map } from 'subtitle';
import { WordGroup } from 'core/services/speech/groupByWord';
import leven from 'leven';

const FUZZY_TOLERANCE = 2;

interface Cue {
  startTime: number;
  endTime: number;
  words: string[];
  text: string;
  mapped?: WordGroup[];
}

export default function compare(subtitleFile: string, wordGroups: WordGroup[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const cues: Cue[] = [];
    const stream = fs.createReadStream(subtitleFile).pipe(parse());
    stream
      .on('data', node => {
        if (node.type === 'cue') {
          const { end, start, text } = node.data;
          const startTime = start / 1000; // ms to seconds
          const endTime = end / 1000; // ms to seconds
          const words = text
            .toLowerCase()
            .replace('\n', ' ')
            .replace(/[^\w ]+/g, '')
            .trim()
            .split(' ');
          cues.push({ startTime, endTime, words, text });
        }
      })
      .on('error', console.error)
      .on('finish', () => {
        // console.log(wordGroups);
        let lastIndex = -1;
        console.log('Cuepoint', cues[0]);
        const mapped = cues.slice(0, 1).map(subCue => {
          const { words } = subCue;
          const found = words
            .map(cueWord => {
              // console.log(`cue: ${cueWord}`);
              for (let i = lastIndex + 1; i < wordGroups.length; i++) {
                const wg = wordGroups[i];
                const matchScore = leven(wg.text, cueWord);
                // console.log('- iter', wg.text, matchScore);
                if (
                  matchScore <= FUZZY_TOLERANCE ||
                  (cueWord.length > 3 && wg.text.length > 3 && new RegExp(`^${wg.text}|${wg.text}`).test(cueWord))
                ) {
                  // console.log('- match', cueWord, wg.text, wg.start_time);
                  lastIndex = i;
                  return wg;
                }
              }
            })
            .filter((wg): wg is WordGroup => !!wg)
            .reduce(
              (obj, wg, index) => {
                return {
                  speech: [...obj.speech, wg.text],
                  start: index === 0 ? wg.start_time : Math.min(obj.start, wg.start_time),
                  end: index === 0 ? wg.end_time : Math.max(obj.end, wg.end_time)
                  // end: Math.max(obj.end, wg.end_time)
                };
              },
              {
                speech: [] as string[],
                start: -1,
                end: -1
              }
            );
          if (found) {
            console.log(found);
            const accuracy = (cues[0].startTime - found.start) * 1000;
            console.log(`SRT Accuracy: ${accuracy} ms`);
          }
        });
        resolve();
      });
  });
}
