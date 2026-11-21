import { chromium } from "@playwright/test";
import fs from "node:fs";
fs.mkdirSync("screenshots", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("console", (m) => {
  if (m.type() === "error") console.log("BROWSER:", m.text());
});
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:8082");
await page.getByText("World Time", { exact: true }).waitFor();
await page.waitForTimeout(1500);
await page.screenshot({ path: "screenshots/world-time.png" });
await page.getByRole("button", { name: "City clock", exact: true }).click();
await page.getByRole("button", { name: "12 hour format" }).waitFor();
await page.waitForTimeout(600);
await page.screenshot({ path: "screenshots/city-detail.png" });
await page.getByRole("button", { name: "12 hour format" }).click();
await page.getByRole("button", { name: "Flip clock layout" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: "screenshots/flip-clock.png" });
await page.getByRole("button", { name: "World map", exact: true }).click();
await page.getByText("Drag to explore · tap a city marker").waitFor();
await page.waitForTimeout(700);
await page.screenshot({ path: "screenshots/world-map.png" });
await page.getByRole("button", { name: "Show UTC+5:45", exact: true }).click();
await page.getByText("Fixed offset", { exact: true }).waitFor();
await page.getByRole("button", { name: "Search cities", exact: true }).click();
await page
  .getByRole("textbox", { name: "Search city or country" })
  .fill("Kathmandu");
await page.getByRole("button", { name: "Add Kathmandu", exact: true }).click();
await page
  .getByRole("button", { name: "Remove Kathmandu", exact: true })
  .waitFor();
await page.reload();
await page
  .getByRole("button", { name: "Remove Kathmandu", exact: true })
  .waitFor();
await page
  .getByRole("textbox", { name: "Search city or country" })
  .fill("Kathmandu");
await page.screenshot({ path: "screenshots/search.png" });
await page
  .getByRole("button", { name: "Remove Kathmandu", exact: true })
  .click();
await page
  .getByRole("button", { name: "Add Kathmandu", exact: true })
  .waitFor();
await page.setViewportSize({ width: 320, height: 568 });
await page.getByRole("button", { name: "City clock", exact: true }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: "screenshots/small-screen.png" });
await browser.close();
if (errors.length) throw Error(errors.join("\n"));
console.log(
  "PASS: navigation, formats, flip layout, map offset, search, add/remove, persistence, small screen. No browser runtime errors.",
);
