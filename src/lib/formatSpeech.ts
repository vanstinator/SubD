import { Metadata } from 'deepspeech';

export default function formatSpeech(data: Metadata) {
  // convert characters to words
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
  }, []);
  return wordGroups.map(group => {
    return group.reduce(
      (prev, current) => {
        prev.text += current.text;
        if (!prev.start_time || current.start_time < prev.start_time) {
          prev.start_time = current.start_time;
        }
        if (!prev.end_time || current.start_time > prev.start_time) {
          prev.end_time = current.start_time;
        }
        return prev;
      },
      { text: '' }
    );
  });
}
