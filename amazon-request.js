const request = require('request-promise-native');
const cheerio = require('cheerio');

const url =
  'https://www.amazon.com/Lenovo-IdeaPad-i5-1035G1-15-6-inch-Screen/dp/B08NXSJVCR';

async function main() {
  let counter = 1;
  while (counter <= 1000) {
    const html = await request.get(url);
    const $ = cheerio.load(html);
    console.log('res', $('#priceblock_ourprice').text(), counter);

    counter++;
    await sleep();
  }
}

async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

main();
