// Imports
import "dotenv/config";
import { HTTPError } from "got";
import got from "got";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

import { getAvailableAppointments } from "./get-available-appointments.js";
import { getBookingPageHtml } from "./get-booking-page-html.js";
import { sendTelegramNotification } from "./send-telegram-notification.js";

// Validate configuration values in .env
const telegramNotificationsEnabled =
  process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID;
validateConfig();

(async () => {
  await sendTelegramNotification("Berlin Buergeramt Bot has started.");
})();

// Setup simple scheduler
const scheduler = new ToadScheduler();
const checkForAppointmentsTask = new AsyncTask(
  "checkForAppointments",
  checkForAppointments,
  handleErrors,
);
const job = new SimpleIntervalJob(
  { minutes: process.env.CHECK_INTERVAL_MINUTES, runImmediately: true },
  checkForAppointmentsTask,
);
scheduler.addSimpleIntervalJob(job);

async function checkForAppointments() {
  let bookingPageHtml;

  try {
    bookingPageHtml = await getBookingPageHtml();
  } catch (err) {
    // For now we do not act on rate limiting. This code only exists to ensure, we're correctly detecting rate limiting.
    if (err instanceof HTTPError && err.request.statusCode === 429) {
      console.error("Bot is rate limited.");
    } else {
      throw err;
    }
  }

  if (!bookingPageHtml) {
    return;
  }

  const dates = getAvailableAppointments(bookingPageHtml);

  if (dates.length > 0 && telegramNotificationsEnabled) {
    const message = `Buergeramt appointments are available now! Check ${process.env.BOOKING_URL}`;
    await sendTelegramNotification(message);
  }

  const date = new Date().toISOString();
  const message = `${dates.length} appointments found.`;
  console.log(`${date} ${message}`);
  // Ping healthchecks.io
  if (process.env.HEALTHCHECKS_IO_TOKEN) {
    await got(`https://hc-ping.com/${process.env.HEALTHCHECKS_IO_TOKEN}`, {
      method: "POST",
      body: message,
    });
  }
}

async function handleErrors(err) {
  console.error(err);
  if (telegramNotificationsEnabled) {
    await sendTelegramNotification(JSON.stringify(err));
  }
}

function validateConfig() {
  const {
    BOOKING_URL,
    USER_AGENT,
    CHECK_INTERVAL_MINUTES,
    HEALTHCHECKS_IO_TOKEN,
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHAT_ID,
  } = process.env;
  if (!BOOKING_URL | !CHECK_INTERVAL_MINUTES) {
    console.error(
      "BOOKING_URL or CHECK_INTERVAL_MINUTES have not been set. Please set values in .env according to README.",
    );
    process.exit(1);
  }

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn(
      "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID has not been set. You will receive no notifications for appointments.",
    );
  }

  if (!USER_AGENT) {
    console.warn(
      "USER_AGENT has not been set. Please add contact information.",
    );
  }

  if (!HEALTHCHECKS_IO_TOKEN) {
    console.info(
      "HEALTHCHECKS_IO_TOKEN has not been set. The script execution will not be monitored.",
    );
  }
}
