const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const ConcatSource = require('webpack-sources').ConcatSource;
const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');

// Taken from https://github.com/imaya/zlib.js
const gunzip_stub = fs.readFileSync(path.resolve(__dirname, 'gunzip.txt')).toString();

function addDecompressStub(b64) {
  const eval_stub = `Function(new TextDecoder('utf-8').decode((new Zlib.Gunzip(atob('${b64}').split('').map(function(x){return x.charCodeAt(0)}))).decompress()))()`;
  return gunzip_stub + eval_stub;
}

class GzipPlugin {
  /**
   * @param {Object} args
   * @param {string | Function} [args.header] Text that will be prepended to the output file.
   * @param {string | Function} [args.footer] Text that will be appended to the output file.
   * @param {string | RegExp} [args.test] Tested against file names to check if they should be affected by this plugin.
   */
  constructor(args) {
    if (typeof args !== 'object') {
      throw new TypeError('Argument "args" must be an object.');
    }

    this.header = args.hasOwnProperty('header') ? args.header : '';
    this.footer = args.hasOwnProperty('footer') ? args.footer : '';
    this.test = args.hasOwnProperty('test') ? args.test : /\.js$/;
  }

  optimize(compilation, assets) {
    const header = this.header;
    const footer = this.footer;
    const tester = { test: this.test };

    for (const fileName in assets) {
      if (!ModuleFilenameHelpers.matchObject(tester, fileName)) {
        continue;
      }

      const headerContent = typeof header === 'function' ? header(fileName, chunkHash) : header;
      const footerContent = typeof footer === 'function' ? footer(fileName, chunkHash) : footer;

      compilation.updateAsset(fileName, (old) => {
        const b64 = zlib.gzipSync(old.source(), { level: zlib.constants.Z_BEST_COMPRESSION }).toString('base64');
        return new ConcatSource(String(headerContent), addDecompressStub(b64), String(footerContent));
      });
    }
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('GzipPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'GzipPlugin',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER,
        },
        (assets) => this.optimize(compilation, assets),
      );
    });
  }
}

module.exports = GzipPlugin;
