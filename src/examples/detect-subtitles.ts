import 'config';
import fs from 'fs';
import extractAudio from 'lib/extractAudio';
import detectSpeech from 'lib/detectSpeech';
import formatSpeech from 'lib/formatSpeech';

const CACHED_RESULTS = './data/cached-results.json';
const MOVIE_FILE = '/Users/brian/Movies/irobot-clip-2.mkv';

function processText(text) {
  const words = formatSpeech(text);
  console.log('words', words);
}

if (fs.existsSync(CACHED_RESULTS)) {
  const text = JSON.parse(fs.readFileSync(CACHED_RESULTS).toString());
  processText(text);
} else {
  detectSpeech(extractAudio(MOVIE_FILE))
    .then(text => {
      fs.writeFileSync(CACHED_RESULTS, JSON.stringify(text));
      console.log('speech', text.transcripts?.[0].tokens);
      processText(text);
    })
    .catch(console.error);
}
