#!/usr/bin/env node

const { GuessLang } = require('../dist/lib/index');
const fs = require('fs');

(function () {
  console.warn('Note: this CLI is only for diagnosing the model results. It should not be depended on in any production system.');
  const filename = process.argv[2];

  if (!filename) {
    console.error('No filename specified. Please pass in the filename as the first argument of invocation.');
    return;
  }

  const content = fs.readFileSync(filename, 'utf8');

  if (content.length <= 20) {
    console.error('Not enough content specified. Please include more content in your invocation.');
    return;
  }

  const guessLang = new GuessLang();
  guessLang.runModel(content).then((result) => console.log(result));
})();
