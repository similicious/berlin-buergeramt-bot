import fs from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getAvailableAppointments } from "../src/get-available-appointments";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test("returns an empty array, when no appointment is available", () => {
  const html = fs.readFileSync(
    join(__dirname, "fixtures", "no-appointment-available.html"),
    { encoding: "utf-8" },
  );

  const appointments = getAvailableAppointments(html);
  expect(appointments).toEqual([]);
});

test("returns one appointment, when one is available", () => {
  const html = fs.readFileSync(
    join(__dirname, "fixtures", "one-appointment-available.html"),
    { encoding: "utf-8" },
  );

  const appointments = getAvailableAppointments(html);
  expect(appointments).toEqual([new Date("2021-10-25T22:00:00.000Z")]);
});

test("returns multiple appointment, when multiple are available", () => {
  const html = fs.readFileSync(
    join(__dirname, "fixtures", "multiple-appointments-available.html"),
    { encoding: "utf-8" },
  );

  const appointments = getAvailableAppointments(html);
  expect(appointments).toEqual([
    new Date("2021-09-07T22:00:00.000Z"),
    new Date("2021-10-25T22:00:00.000Z"),
  ]);
});
