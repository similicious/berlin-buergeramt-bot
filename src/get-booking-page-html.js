import got from "got";

export async function getBookingPageHtml() {
  // Request booking url to receive the booking system cookie
  let res = await got(process.env.BOOKING_URL, {
    headers: { "user-agent": process.env.USER_AGENT },
    // As got isn't following redirects properly, we have to make the second request explicitly
    followRedirect: false,
  });

  // Get cookie
  const cookie = res.headers["set-cookie"][0];

  // Request appointment page using the cookie
  res = await got("https://service.berlin.de/terminvereinbarung/termin/day/", {
    headers: {
      cookie: cookie,
      "user-agent": process.env.USER_AGENT,
    },
    followRedirect: false,
  });
  return res.body;
}
