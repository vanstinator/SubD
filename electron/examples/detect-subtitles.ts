import 'config';
import extractAudio from 'lib/extractAudio';
import detectSpeech from 'lib/detectSpeech';

const MOVIE_FILE =
  'https://archive.org/download/cartoon-network-21st-century/Cartoon%20Network%20-%2021st%20century.mp4';

const audioStream = extractAudio(MOVIE_FILE);
detectSpeech(audioStream)
  .then(text => {
    // console.log('speech', text.transcripts?.[0].tokens);
    console.log('Detected text:', text);
  })
  .catch(console.error);
