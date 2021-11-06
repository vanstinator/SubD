import srtOffset from 'utils/srtOffset';

const OFFSET = -2005;
const SUBFILE = '/Users/brian/Movies/irobot-clip-2-offset.srt';

const data = srtOffset(SUBFILE, OFFSET);
console.log(data);
