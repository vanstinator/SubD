# SubD

This project's goal is to create a (probably over-engineered) solution to turn your bad subtitles and into great subtitles.

## Setup

Install project dependencies and start with:

```bash
npm install
npm start
```

### Example

Run the detection example:

```bash
npm run detect
```

## What's Under The Hood?

### DeepSpeech

DeepSpeech is an open source Speech-To-Text engine, using a model trained by machine learning.
https://deepspeech.readthedocs.io/en/r0.9/index.html

### FFMPEG

We use ffmpeg to take any input media and decode into raw PCM audio for deepspeech.
