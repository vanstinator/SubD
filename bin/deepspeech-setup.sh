DATA_DIR=./data

MODELS=deepspeech-0.9.3-models.pbmm
SCORER=deepspeech-0.9.3-models.scorer
AUDIO=audio-0.9.3.tar.gz

MODELS_PATH="$DATA_DIR/$MODELS"
SCORER_PATH="$DATA_DIR/$SCORER"
AUDIO_PATH="$DATA_DIR/$AUDIO"

mkdir -p "$DATA_DIR"

# Download pre-trained English model files
if [ -f "$MODELS_PATH" ]; then
  echo "Models file already exists."
else 
  echo "Downloading models file ($MODELS)"
  curl -L --output "$MODELS_PATH" "https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/$MODELS"
fi

if [ -f "$SCORER_PATH" ]; then
  echo "Scorer file already exists."
else 
  echo "Downloading scorer file ($SCORER)"
  curl -L --output "$SCORER_PATH" "https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/$SCORER"
fi

if [ -f "$AUDIO_PATH" ]; then
  echo "Audio files already exist."
else 
  echo "Downloading audio files ($AUDIO)"
  curl -L --output "$AUDIO_PATH" "https://github.com/mozilla/DeepSpeech/releases/download/v0.9.3/$AUDIO"
  tar xvf "$AUDIO_PATH" --directory "$DATA_DIR"
fi

echo "Finished installing deepspeech assets!"