const puppeteer = require('puppeteer');

const url =
  'https://www.amazon.com/Lenovo-IdeaPad-i5-1035G1-15-6-inch-Screen/dp/B08NXSJVCR';

async function getPrices() {
  const browser = await puppeteer.launch({
    headless: true,
    // defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });


  const price = await page.$eval('#priceblock_ourprice', el => el.innerText)
  console.log('price', price)

  await browser.close();



}

getPrices();