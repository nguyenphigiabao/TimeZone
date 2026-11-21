import { test } from "node:test";
import assert from "node:assert/strict";
import { clock, offsetMinutes, utcLabel, sun } from "../services/time";
import { cities } from "../constants/cities";
test("IANA zones and date rollover", () => {
  const d = new Date("2026-01-01T23:30:00Z");
  assert.equal(clock(d, "Asia/Tokyo").hour, "08");
  assert.equal(clock(d, "Australia/Sydney").hour, "10");
  assert.equal(clock(d, "America/New_York").hour, "18");
  assert.equal(clock(d, "Europe/London").hour, "23");
});
test("DST boundaries are computed from the instant", () => {
  assert.equal(
    offsetMinutes(new Date("2026-03-08T06:59:00Z"), "America/New_York"),
    -300,
  );
  assert.equal(
    offsetMinutes(new Date("2026-03-08T07:00:00Z"), "America/New_York"),
    -240,
  );
  assert.equal(
    offsetMinutes(new Date("2026-03-29T00:59:00Z"), "Europe/London"),
    0,
  );
  assert.equal(
    offsetMinutes(new Date("2026-03-29T01:00:00Z"), "Europe/London"),
    60,
  );
  assert.equal(
    offsetMinutes(new Date("2026-04-04T15:59:00Z"), "Australia/Sydney"),
    660,
  );
  assert.equal(
    offsetMinutes(new Date("2026-04-04T16:00:00Z"), "Australia/Sydney"),
    600,
  );
});
test("fractional offsets", () => {
  assert.equal(offsetMinutes(new Date(), "Asia/Kathmandu"), 345);
  assert.equal(utcLabel(345), "UTC+5:45");
  assert.equal(utcLabel(-210), "UTC−3:30");
  assert.equal(utcLabel(0), "UTC 0");
});
test("12h midnight and noon", () => {
  assert.deepEqual(clock(new Date("2026-01-01T00:05:09Z"), "UTC", true), {
    hour: "12",
    minute: "05",
    second: "09",
    period: "AM",
  });
  assert.equal(
    clock(new Date("2026-01-01T12:00:00Z"), "UTC", true).period,
    "PM",
  );
  assert.equal(clock(new Date("2026-01-01T00:00:00Z"), "UTC").hour, "00");
});
test("sunrise uses the city calendar date, stable across the same local day", () => {
  const city = cities.find((c) => c.id === "tokyo")!;
  const a = sun(new Date("2026-06-20T16:00:00Z"), city);
  const b = sun(new Date("2026-06-21T05:00:00Z"), city);
  assert.equal(a.range, b.range);
  assert.equal(a.day, false);
  assert.equal(b.day, true);
  assert.match(a.range, /\d{2}:\d{2} – \d{2}:\d{2}/);
});
