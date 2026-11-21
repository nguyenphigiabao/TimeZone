import fs from "node:fs";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";
const topology = JSON.parse(
  fs.readFileSync("node_modules/world-atlas/countries-110m.json", "utf8"),
);
const projection = geoMercator()
  .scale(180 / Math.PI)
  .translate([180, 150]);
const path = geoPath(projection).digits(2);
const countries = feature(topology, topology.objects.countries)
  .features.filter((f) => f.id !== "010")
  .map((f) => ({ id: f.id, name: f.properties.name, d: path(f) }));
fs.mkdirSync("assets", { recursive: true });
fs.writeFileSync("assets/countries.json", JSON.stringify(countries));
