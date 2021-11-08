import 'config';
import audioStream from 'core/services/media/audioStream';
import detectSpeech from 'core/services/speech/detect';

const MOVIE_FILE =
  'https://archive.org/download/cartoon-network-21st-century/Cartoon%20Network%20-%2021st%20century.mp4';

const stream = audioStream(MOVIE_FILE);
detectSpeech(stream)
  .then(text => {
    // console.log('speech', text.transcripts?.[0].tokens);
    console.log('Detected text:', text);
  })
  .catch(console.error);
