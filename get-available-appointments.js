const cheerio = require('cheerio');

function getAvailableAppointments(html) {

  const $ = cheerio.load(html);
  const termin = $('table td.buchbar');
  if (termin.length !== 0) {
    console.log(termin.find('a').attr('href'))
  }
}

module.exports = getAvailableAppointments;
