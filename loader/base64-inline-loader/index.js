// Modified from https://github.com/monolithed/base64-inline-loader/blob/631e983477d9836596e7e8f5c0af53156c4fb670/index.js

module.exports = function (content) {
  if (this.cacheable) {
    this.cacheable();
  }

  const base64 = content.toString('base64');
  return `module.exports = ${JSON.stringify(base64)}`;
};

module.exports.raw = true;
