#!/bin/bash
# Build script for deployment
# This builds the React frontend so Flask can serve it

cd frontend
npm install
npm run build
cd ..
pip install -r requirements.txt
