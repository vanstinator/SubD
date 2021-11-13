#!/bin/bash

DS_PATH="./node_modules/deepspeech/lib/binding/v0.10.0-alpha.3/darwin-x64"

if [[ ! $OSTYPE == 'darwin'* ]]; then
  echo "Patch currently only works on MacOS"
  exit 0
fi

if [ -f "$DS_PATH/electron-v15.3" ]; then
  echo "Deepspeech already fixed"
else
  curl -L https://github.com/vanstinator/SubD/files/7532394/electron-v15.3.zip -o "$DS_PATH/electron-v15.3.zip"
  mkdir "$DS_PATH/electron-v15.3"
  unzip "$DS_PATH/electron-v15.3.zip" -d "$DS_PATH"
fi