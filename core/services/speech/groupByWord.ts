import { Metadata, TokenMetadata } from 'deepspeech';

export interface WordGroup {
  text: string;
  start_time: number;
  end_time: number;
}

export default function groupByWord(data: Metadata): WordGroup[] {
  // convert characters to words
  console.log('data.transcripts', data.transcripts.length);
  const tokens = data.transcripts?.[0].tokens;
  const wordGroups = tokens.reduce((prev, token) => {
    if (!prev.length && token.text !== ' ') {
      prev.push([token]);
      return prev;
    }
    if (token.text === ' ') {
      prev.push([]);
    } else {
      prev[prev.length - 1].push(token);
    }
    return prev;
  }, [] as TokenMetadata[][]);

  return wordGroups.map(group => {
    return group.reduce(
      (prev, current, index) => {
        prev.text += current.text;
        return prev;
      },
      {
        text: '',
        end_time: Math.max(...group.map(({ start_time }) => start_time)),
        start_time: Math.min(...group.map(({ start_time }) => start_time))
      }
    );
  });
}
