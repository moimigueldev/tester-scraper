const puppeteer = require('puppeteer');
const $ = require('cheerio'); // implementation of jquery on the backend

const puppeteerExtra = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteerExtra.use(pluginStealth());
// const browser = await puppeteerExtra.launch({ headless: true });

const url =
  'https://www.amazon.com/Samsung-970-EVO-500GB-MZ-V7E500BW/dp/B07BN4NJ2J';
let browser;
let page;

async function configureBrowser() {
  browser = await puppeteerExtra.launch({ headless: true });
  // browser = await puppeteer.launch(); // init browser
  page = await browser.newPage(); // init page
  await page.goto(url);
  await page.screenshot({ path: 'example5.png' });

  const textContent = await page.evaluate(() =>
    console.log(document.querySelector('#priceblock_ourprice'))
  );
  console.log('textContent', textContent);

  return page;
}

// ('priceblock_ourprice');

async function checkPrice(page) {
  await page.reload();
  let html = await page.evaluate(() => document.body.innerHTML);
  // console.log('html', html);

  // $('#priceblock_dealprice', html).each(function () {
  //   let dollarPrice = $(this).text();
  //   console.log('dollarPrince', dollarPrice);
  //   // console.log(dollarPrice);
  //   let currentPrice = Number(dollarPrice.replace(/[^0-9.-]+/g, ''));

  //   // if (currentPrice < 300) {
  //   //     console.log("BUY!!!! " + currentPrice);
  //   //     sendNotification(currentPrice);
  //   // }
  // });
}

async function monitor() {
  let page = await configureBrowser();
  await checkPrice(page);
  await page.close();
  await browser.close();
}

monitor();
