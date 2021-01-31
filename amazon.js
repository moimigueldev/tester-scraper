require('dotenv').config();
const puppeteer = require('puppeteer');
const Captcha = require('2captcha');
const fs = require('fs');
const Stream = require('stream').Transform;
const request = require('request');
const http = require('http');
const { mainModule } = require('process');
0;
const url =
  'https://www.amazon.com/Lenovo-IdeaPad-i5-1035G1-15-6-inch-Screen/dp/B08NXSJVCR';

async function getPrices() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    slowMo: 10,
  });

  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  const image = await page.$eval('img', (el) => {
    return el.src;
  });
  console.log('image', image);

  let solver = new Captcha.Solver(process.env.CAPTCHAKEY);

  let res = await download(image, 'image.png', async () => {
    console.log('✅ Done!');
    let answer = await solver
      .imageCaptcha(fs.readFileSync('image.png', 'base64'))
      .then((res) => {
        return res.data;
      });
    console.log('answer', answer);
    await page.evaluate((a) => {
      document.querySelector('input[placeholder="Type characters"]').value = a;
    }, answer);
    await page.click('button.a-button-text');
  });
}

const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on('close', callback);
  });
};

getPrices();
