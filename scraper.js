const puppeteer = require('puppeteer');

const url =
  'https://www.amazon.com/Samsung-970-EVO-500GB-MZ-V7E500BW/dp/B07BN4NJ2J';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({ path: 'example.png' });

  console.log('hello world');
  await browser.close();
})();
