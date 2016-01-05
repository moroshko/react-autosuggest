#!/bin/bash

set -e

git checkout gh-pages
git pull origin gh-pages
git merge master --no-edit
npm run gh-pages-build
cp demo/dist/*.* .
git add app.css autosuggest.css index.html index.js
git commit -m 'Update gh-pages files'
git push origin gh-pages
git checkout master
