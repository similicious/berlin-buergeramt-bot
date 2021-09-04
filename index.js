require('dotenv').config()
const got = require('got');

const getAvailableAppointments = require('./get-available-appointments');

(async () => {

  // Request booking url to receive the booking system cookie
  let res = await got(process.env.BOOKING_URL, {
    headers: { 'user-agent': process.env.USER_AGENT },
    followRedirect: false
  });

  // Get cookie
  const cookie = res.headers['set-cookie'][0];

  // Request appointment page using the cookie
  res = await got('https://service.berlin.de/terminvereinbarung/termin/day/', {
    headers: {
      'cookie': cookie,
      'user-agent': process.env.USER_AGENT
    },
    followRedirect: false
  });

  getAvailableAppointments(res.body);

})();
