#!/bin/bash

if command -v apt-get >/dev/null; then
  apt-get update
  apt-get install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
else
  echo "Do not pre-build"
fi
