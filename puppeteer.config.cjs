const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Ensure we use the current working directory to store the browser
  cacheDirectory: join(process.cwd(), '.cache', 'puppeteer'),
};