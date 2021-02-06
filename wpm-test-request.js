const request = require('request-promise-native');
const cheerio = require('cheerio');

const url = 'https://play.typeracer.com/';

async function main() {
  var options = {
    url,
    timeout: 10000, //set waiting time till 10 minutes.
  };
  const html = await request.get(options);

  const $ = cheerio.load(html, 2000);
  console.log('hhello', $('a.gwt-Anchor.prompt-button.bkgnd-green').text());
}

async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
}

main();
