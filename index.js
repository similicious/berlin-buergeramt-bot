// Imports
require('dotenv').config()
const got = require('got');
const { ToadScheduler, SimpleIntervalJob, AsyncTask } = require('toad-scheduler')

const getAvailableAppointments = require('./get-available-appointments');
const getBookingPageHtml = require('./get-booking-page-html');

// Setup simple scheduler
const scheduler = new ToadScheduler()
const checkForAppointmentsTask = new AsyncTask('checkForAppointments', checkForAppointments, console.err)
const job = new SimpleIntervalJob({ minutes: process.env.CHECK_INTERVAL_MINUTES, runImmediately: true }, checkForAppointmentsTask)
scheduler.addSimpleIntervalJob(job)

async function checkForAppointments() {

  let bookingPageHtml = await getBookingPageHtml();
  const dates = getAvailableAppointments(bookingPageHtml);

  // Ping healthchecks.io
  if(process.env.HEALTHCHECKS_IO_TOKEN) {
    await got(`https://hc-ping.com/${process.env.HEALTHCHECKS_IO_TOKEN}`)
  }

  console.log(dates);
};
