require('dotenv').config();
const puppeteer = require('puppeteer');
const { del } = require('request');

const url = 'https://www.keyhero.com/free-typing-test/';

async function start() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 10,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  //   await signin(page);
  //   console.log('done login in...');

  loop(page, 10);

  //   await browser.close();
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function signin(page) {
  return new Promise(async (resolve, reject) => {
    await page.click('a[href="/accounts/login/"]');
    await page.click('a[href="/logincreate/"]');

    await delay(500);
    await page.evaluate((a) => {
      document.querySelector('#id_usernamelogin').value = a;
    }, process.env.WPMUSER);
    await page.evaluate((a) => {
      document.querySelector('#id_password').value = a;
    }, process.env.WPMPASS);

    await page.click('input[value="Login"]');

    await page.goto(url, { waitUntil: 'networkidle2' });

    resolve();
  });
}

async function loop(page, counter) {
  let loopCounter = 0;
  while (counter > 0) {
    console.log('loop #', loopCounter);

    await page.click('button.start-button.btn.btn-lg.btn-success');

    await delay(3000);

    const quote = await page.$$eval('.quote span', (el) => {
      return el
        .map((span) => {
          return span.innerText;
        })
        .join('');
    });

    process.env.QUOTE = quote;

    console.log(process.env.QUOTE);

    await page.type('input.user-input-text', process.env.QUOTE, {
      delay: 0.0000001,
    });

    let results = await page.$eval(
      'span[data-reactid=".0.1.1.1.0"]',
      (el) => el.innerText
    );
    console.log('results', parseInt(results) + 'wpm');

    loopCounter++;
  }
}

start();
