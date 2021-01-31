require('dotenv').config();
const puppeteer = require('puppeteer');
const Captcha = require('2captcha');
const fs = require('fs');
const request = require('request-promise-native');
const poll = require('promise-poller').default;
// const { timeout } = require('promise-poller/dist/lib/util');
const captchaSolver = require('2captcha-node');

const url = 'https://recaptcha-demo.appspot.com/recaptcha-v2-checkbox.php';

const config = {
  sitekey: '',
  pageUrl: url,
  apiKey: process.env.CAPTCHAKEY,
  apiSubmitUrl: 'http://2captcha.com/in.php',
  apiRetrieveUrl: 'http://2captcha.com/res.php',
};

async function start() {
  //   const solver = new Captcha.Solver(process.env.CAPTCHAKEY);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    slowMo: 10,
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const sitekey = await page.$eval(
    'div.g-recaptcha.form-field',
    (el) => el.dataset.sitekey
  );
  config.sitekey = sitekey;

  const requestId = await initCaptchaRequest(config.apiKey);

  const response = await pollForRequestResults(config.apiKey, requestId);

  await page.evaluate(
    `document.getElementById("g-recaptcha-response").innerHTML="${response}";`
  );

  page.click('button.form-field');

  //   await browser.close();
}

async function initCaptchaRequest(apiKey) {
  const formData = {
    method: 'userrecaptcha',
    googleKey: config.sitekey,
    key: apiKey,
    pageUrl: url,
    json: 1,
  };
  console.log(`submitting solution rquest to 2captcha for ${config.pageUrl}`);
  const response = await request.post(config.apiSubmitUrl, { form: formData });
  return JSON.parse(response).request;
}

async function pollForRequestResults(
  key,
  id,
  retries = 30,
  interval = 1500,
  delay = 15000
) {
  await timeout(delay);
  return poll({
    taskFn: requestCaptchaResults(key, id),
    interval,
    retries,
  });
}

function requestCaptchaResults(apiKey, requestId) {
  const cUrl = `http://2captcha.com/res.php?key=${apiKey}&action=get&id=${requestId}&json=1`;
  return async function () {
    return new Promise(async function (resolve, reject) {
      const rawResponse = await request.get(cUrl);
      const resp = JSON.parse(rawResponse);
      console.log('resp', resp);
      if (resp.status === 0) return reject(resp.request);
      resolve(resp.request);
    });
  };
}

const timeout = (millis) =>
  new Promise((resolve) => setTimeout(resolve, millis));

start();
