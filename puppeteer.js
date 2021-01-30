const puppeteer = require('puppeteer');
const $ = require('cheerio'); // implementation of jquery on the backend

const url =
  'https://www.amazon.com/Samsung-970-EVO-500GB-MZ-V7E500BW/dp/B07BN4NJ2J';

async function configureBrowser() {
  const browser = await puppeteer.launch(); // init browser
  const page = await browser.newPage(); // init page
  await page.goto(url);

  return page;
}

// ('priceblock_ourprice');

async function checkPrice(page) {
  await page.reload();
  let html = await page.evaluate(() => document.body.innerHTML);

  $('#priceblock_dealprice', html).each(function () {
    let dollarPrice = $(this).text();
    console.log('dollarPrince', dollarPrice);
    // console.log(dollarPrice);
    let currentPrice = Number(dollarPrice.replace(/[^0-9.-]+/g, ''));

    // if (currentPrice < 300) {
    //     console.log("BUY!!!! " + currentPrice);
    //     sendNotification(currentPrice);
    // }
  });
}

async function monitor() {
  let page = await configureBrowser();
  await checkPrice(page);
}

monitor();
