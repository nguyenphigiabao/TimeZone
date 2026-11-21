import * as SunCalc from "suncalc";
import { City } from "../constants/cities";
const cache = new Map<string, Intl.DateTimeFormat>();
function formatter(zone: string, twelve = false) {
  const key = zone + twelve;
  if (!cache.has(key))
    cache.set(
      key,
      new Intl.DateTimeFormat("en-GB", {
        timeZone: zone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: twelve ? "h12" : "h23",
      }),
    );
  return cache.get(key)!;
}
export function clock(date: Date, zone: string, twelve = false) {
  const parts = formatter(zone, twelve).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    hour: get("hour"),
    minute: get("minute"),
    second: get("second"),
    period: get("dayPeriod").toUpperCase(),
  };
}
export function offsetMinutes(date: Date, zone: string) {
  const p = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    timeZoneName: "longOffset",
  })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")!.value;
  const match = p.match(/GMT([+-])(\d{2}):(\d{2})/);
  return match ? (match[1] === "-" ? -1 : 1) * (+match[2] * 60 + +match[3]) : 0;
}
export function utcLabel(minutes: number) {
  return `UTC${minutes === 0 ? " 0" : `${minutes < 0 ? "−" : "+"}${Math.floor(Math.abs(minutes) / 60)}${Math.abs(minutes) % 60 ? ":" + String(Math.abs(minutes) % 60).padStart(2, "0") : ""}`}`;
}
export function sun(date: Date, city: City) {
  // Anchor the calculation at noon on the city's calendar date, independent of device timezone.
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: city.zone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (t: string) => Number(p.find((x) => x.type === t)!.value);
  const noon = new Date(
    Date.UTC(get("year"), get("month") - 1, get("day"), 12) -
      offsetMinutes(date, city.zone) * 60000,
  );
  const times = SunCalc.getTimes(noon, city.lat, city.lon);
  const sunrise = times.sunrise ?? new Date(NaN);
  const sunset = times.sunset ?? new Date(NaN);
  const valid = Number.isFinite(+sunrise) && Number.isFinite(+sunset);
  const day = valid
    ? date >= sunrise && date < sunset
    : SunCalc.getPosition(date, city.lat, city.lon).altitude > 0;
  const duration = valid
    ? Math.round((+sunset - +sunrise) / 60000)
    : day
      ? 1440
      : 0;
  const format = (d: Date) => {
    const t = clock(d, city.zone);
    return `${t.hour}:${t.minute}`;
  };
  return {
    day,
    duration: `${Math.floor(duration / 60)}h ${String(duration % 60).padStart(2, "0")}m`,
    range: valid
      ? `${format(sunrise)} – ${format(sunset)}`
      : day
        ? "Polar day"
        : "Polar night",
  };
}
