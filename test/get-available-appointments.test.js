const fs = require("fs");
const { join } = require("path");
const getAvailableAppointments = require("../src/get-available-appointments");

test("returns an empty array, when no appointment is available", () => {
  const html = fs.readFileSync(
    join(__dirname, "fixtures", "no-appointment-available.html"),
    { encoding: "utf-8" }
  );

  const appointments = getAvailableAppointments(html);
  expect(appointments).toEqual([]);
});

test("returns one appointment, when one is available", () => {
  const html = fs.readFileSync(
    join(__dirname, "fixtures", "one-appointment-available.html"),
    { encoding: "utf-8" }
  );

  const appointments = getAvailableAppointments(html);
  expect(appointments).toEqual([new Date("2021-10-25T22:00:00.000Z")]);
});

test("returns multiple appointment, when multiple are available", () => {
  const html = fs.readFileSync(
    join(__dirname, "fixtures", "multiple-appointments-available.html"),
    { encoding: "utf-8" }
  );

  const appointments = getAvailableAppointments(html);
  expect(appointments).toEqual([
    new Date("2021-09-07T22:00:00.000Z"),
    new Date("2021-10-25T22:00:00.000Z"),
  ]);
});
