import detectSpeech from 'core/services/speech/detect';
import groupByWord from 'core/services/speech/groupByWord';
import compareToSubtitle from 'core/services/subtitles/compare';

export default async function analyzeJob(
  mediaPath: string,
  subtitlePath: string,
  onProgress: (percent: number) => void
) {
  const speech = await detectSpeech(mediaPath, onProgress);
  const words = groupByWord(speech.text);
  if (words) {
    compareToSubtitle(subtitlePath, words);
  }
  return {
    score: 100
  };
}
