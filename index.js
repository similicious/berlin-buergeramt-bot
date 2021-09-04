require('dotenv').config()
const got = require('got');
const cheerio = require('cheerio');
const fs = require('fs');

getAvailableAppointments();

async function getAvailableAppointments() {

  let res = await got(process.env.BOOKING_URL, {
    headers: { 'user-agent': process.env.USER_AGENT },
    followRedirect: false
  });

  const cookie = res.headers['set-cookie'][0];

  res = await got('https://service.berlin.de/terminvereinbarung/termin/day/', {
    headers: {
      'cookie': cookie,
      'user-agent': process.env.USER_AGENT
    },
    followRedirect: false
  });

  // res = fs.readFileSync(__dirname + '/test/fixtures/appointment-available.html', { encoding: 'utf8' });

  const $ = cheerio.load(res);
  const termin = $('table td.buchbar');
  if (termin.length !== 0) {
    console.log(termin.find('a').attr('href'))
  }
}