// priceblock_ourprice
const nightmare = require('nightmare')();

async function checkPrice() {
  console.time('checkPrice');
  // goes to the url
  const priceString = await nightmare
    .goto(
      'https://www.amazon.com/Samsung-970-EVO-500GB-MZ-V7E500BW/dp/B07BN4NJ2J'
    )
    .wait('#priceblock_ourprice')
    .evaluate(() => {
      return document.getElementById('priceblock_ourprice').innerText;
    })
    .end();

  const priceNumber = parseFloat(priceString.replace('$', ''));

  console.log('priceString', priceString);
  console.log('priceNumber', priceNumber);

  if (priceNumber < 200) {
    console.log('it is expensive');
  }

  console.timeEnd('checkPrice');
}

checkPrice();
