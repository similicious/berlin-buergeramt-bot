const cheerio = require("cheerio");

function getAvailableAppointments(html) {
  const $ = cheerio.load(html);
  const appointmentLinks = $("td.buchbar a");
  return appointmentLinks
    .map((_, appointmentLink) => {
      const appointmentUrl = appointmentLink.attribs["href"];
      const appointmentDate = appointmentUrl.split("/")[4];
      return new Date(appointmentDate * 1000);
    })
    .toArray();
}

module.exports = getAvailableAppointments;
