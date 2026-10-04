#!/usr/bin/env bash
set -o errexit

# Install backend dependencies
pip install -e .

# Build frontend
cd frontend
npm install
npm run build
cd ..
