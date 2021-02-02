require('dotenv').config();
const puppeteer = require('puppeteer');
const Captcha = require('2captcha');
const fs = require('fs');
const Stream = require('stream').Transform;
const request = require('request');
const http = require('http');

const url = 'https://play.typeracer.com/';

let browser;
let page;

async function start() {
  browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    slowMo: 10,
  });
  page = await browser.newPage();

  play(page);

  //   await page.goto(url, { waitUntil: 'networkidle2' });
  //   //   await page.goto(url);
  //   //   await delay(5000);
  //   await page.click('a[title="Keyboard shortcut: Ctrl+Alt+I"]');

  //   await delay(3000);

  //   const quote = await page.$$eval('span[unselectable="on"]', (el) => {
  //     return el
  //       .map((span) => {
  //         return span.innerText;
  //       })
  //       .join('');
  //   });

  //   //   const time = await page.$eval('.timeDisplay .time', (el) => el.innerText);
  //   const time = await page.$$eval('.time', (els) => {
  //     let spans = els.map((span) => {
  //       return span.innerText;
  //     });

  //     return spans[1].replace(':', '');
  //   });

  //   //   console.log('quote', quote);
  //   console.log('time', parseInt(time));
  //   await delay(parseInt(time) * 1500);

  //   await page.type('.txtInput', quote, {
  //     delay: 10,
  //   });
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

async function play(page) {
  let counter = 5;
  while (counter > 0) {
    console.log('loop number: ', counter);

    await page.goto(url, { waitUntil: 'networkidle2' });
    //   await page.goto(url);
    //   await delay(5000);
    await page.click('a[title="Keyboard shortcut: Ctrl+Alt+I"]');

    await delay(3000);

    const quote = await page.$$eval('span[unselectable="on"]', (el) => {
      return el
        .map((span) => {
          return span.innerText;
        })
        .join('');
    });

    //   const time = await page.$eval('.timeDisplay .time', (el) => el.innerText);
    const time = await page.$$eval('.time', (els) => {
      let spans = els.map((span) => {
        return span.innerText;
      });

      return spans[1].replace(':', '');
    });

    //   console.log('quote', quote);
    console.log('time', parseInt(time));
    await delay(parseInt(time) * 1100);

    await page.type('.txtInput', quote, {
      delay: 0.005,
    });

    let results = await page.$eval(
      '.rankPanelWpm.rankPanelWpm-self',
      (el) => el.innerText
    );
    console.log('results', results);

    await delay(5000);

    counter--;
  }
}

start();
