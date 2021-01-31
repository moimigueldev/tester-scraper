// priceblock_ourprice
const nightmare = require('nightmare')();

async function checkPrice() {
  await new Promise(async (resolve, reject) => {
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
      console.log('it is expensive', priceNumber);
    } else {
      console.log('no', priceNumber);
    }

    resolve(priceNumber);
  });
}

async function checkPrice1() {
  return Promise.resolve(
    nightmare
      .goto(
        'https://www.amazon.com/Samsung-970-EVO-500GB-MZ-V7E500BW/dp/B07BN4NJ2J'
      )
      .wait('#priceblock_ourprice')

      .then(function (result) {
        console.log('done', result);
        return;
      })
  );
}

// Promise.resolve(  // call for the promises library with the nightmare instance
//   nightmare
//   .goto() //all the calls that you need
//   .wait()
//   .....
//   ).then(function (result) { //This function will be called when the block of commands is done , with the result.
//         console.log("Done")
//   }, function (err) { //Error handling
//         console.log(err);
// });

async function run() {
  // for (let index = 0; index < 20; index++) {}
  let temp = [1, 2];

  temp.forEach(async (el) => {
    console.log('running', el);
    let price = await checkPrice1();
    console.log('price', price);
  });
}

run();
