// eslint-disable-next-line @typescript-eslint/no-require-imports
const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Tells pnpm to store Chrome in your project's .cache folder
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};