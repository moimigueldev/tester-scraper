const puppeteer = require('puppeteer');

// const url =
//   'https://www.amazon.com/Samsung-970-EVO-500GB-MZ-V7E500BW/dp/B07BN4NJ2J';

const url =
  'https://minneapolis.craigslist.org/d/for-sale/search/sss?query=laptop&sort=rel';

async function getProduct() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });
  // execute standard javascript in the context of the page.
  const rows = await page.$$eval('.result-row', (rows) => {
    console.log('hellllow');
    return rows.map((row) => {
      // return row.querySelector('a').innerText;
      // return row.querySelector('a').getAttribute('href');
      // return row.querySelector('.result-info .result-heading a').innerText;
      const properties = {};
      properties.link = row.querySelector('a').getAttribute('href');
      properties.title = row.querySelector(
        '.result-info .result-heading a'
      ).innerText;
      properties.price = row.querySelector('a').innerText;
      return properties;
    });
  });
  console.log(rows);
  // await page.tracing.stop()
  // await browser.close()

  // console.log(results);
  // await page.tracing.stop();
  await browser.close();
} //end of getProduct

getProduct();
