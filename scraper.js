const puppeteer = require('puppeteer');


// const url =
//   'https://www.amazon.com/Samsung-970-EVO-500GB-MZ-V7E500BW/dp/B07BN4NJ2J';

// const url =
//   'https://minneapolis.craigslist.org/search/sss?query=bike&sort=rel&purveyor-input=all';
const url =
  'https://minneapolis.craigslist.org/d/for-sale/search/sss?query=laptop&sort=rel';
let results = [];

async function getInfo(page) {
  return new Promise(async (resolve, reject) => {
    const rows = await page.$$eval('.result-row', (rows) => {
      return rows.map((row) => {
        const properties = {};
        properties.link = row.querySelector('a').getAttribute('href');
        properties.title = row.querySelector(
          '.result-info .result-heading a'
        ).innerText;
        properties.price = row.querySelector('a').innerText;
        return properties;
      });
    });
    resolve(rows);
  });
}

async function loopInfo(page) {
  return new Promise(async (resolve, reject) => {
    let firstInteration = true;
    let counter = 0;
    let row;
    let nextBtn = '';

    let currentCount = await page.$eval('span.rangeTo', (el) => el.innerText);
    let totalCount = await page.$eval('span.totalcount', (el) => el.innerText);
    while (Number(currentCount) <= Number(totalCount)) {
      // nextBtn = await page.$eval('a.button.next', (el) => el.href);
      // await page.waitForSelector('a.button.next', {visible: true})
      if (Number(currentCount) === Number(totalCount)) {
        console.log('loop: ', currentCount, totalCount);
        firstInteration = false;
        rows = await getInfo(page);
        results.push(...rows);
        // await page.waitForFunction("document.querySelector('a.button.next') && document.querySelector('a.button.next').clientHeight != 0");
        // await page.click('a.button.next');
        // await page.waitForNavigation({ waitUntil: 'networkidle2' });
        // currentCount = await page.$eval('span.rangeTo', (el) => el.innerText);
        // totalCount = await page.$eval('span.totalcount', (el) => el.innerText);
        break;
      } else {
        console.log('loop: ', currentCount, totalCount);
        firstInteration = false;
        rows = await getInfo(page);
        results.push(...rows);
        await page.waitForFunction("document.querySelector('a.button.next') && document.querySelector('a.button.next').clientHeight != 0");
        await page.click('a.button.next');
        // await page.waitForNavigation({ waitUntil: 'networkidle2' });
        currentCount = await page.$eval('span.rangeTo', (el) => el.innerText);
        totalCount = await page.$eval('span.totalcount', (el) => el.innerText);
      }
  
      
      // if (Number(currentCount) > Number(totalCount)) {
      //   console.log('breaking', currentCount)
      //   rows = await getInfo(page);
      // results.push(...rows);
      //   break;
      // }
      counter++;
    }
    resolve(true);
  });
}

async function getProduct() {
  console.time('func')
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  await loopInfo(page);



  await browser.close();

  console.timeEnd('func')
} //end of getProduct

 function filter() {

  return results = results.filter(item => {

    return Number(item.price.replace('$', '')) > 500 && Number(item.price.replace('$', '')) < 1000;
  })


}

getProduct();
