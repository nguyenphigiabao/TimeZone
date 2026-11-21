# TimeZone — World Clock

A minimalist world clock built with React Native, TypeScript, and Expo Router. Inspired by the supplied design references, TimeZone pairs a soft gray background with oversized typography, black selected cards, and three circular navigation buttons.

## Demo

A recording and four screenshots supplied by the project owner showcase the app's interface.

<img src="https://s2.ezgif.com/tmp/ezgif-26b8bcbadc10dbff.gif" controls preload="metadata" width="360">
  Your Markdown viewer may not support embedded video. Use the link below to open the recording.
</img>

**[Watch or download the demo video](docs/media/timezone-demo.mp4)**

If your Markdown viewer does not display the video player, use the link above.

## Screenshots

<table>
  <tr>
    <th>World Time</th>
    <th>Search Cities</th>
  </tr>
  <tr>
    <td><img src="https://i.postimg.cc/85qb7Wc3/1795248733443-846140286607117484-1383753122617253414-b60b61dcc0044304c1f03a5b06b5022d.jpg" alt="World Time showing five saved cities with New York selected" width="300" /></td>
    <td><img src="https://i.postimg.cc/151HPpLW/1795248733464-846140286607117484-1383753122617253414-54b841df9b175cceebab24c09c71328a.jpg" alt="Search results for Vietnam showing Ho Chi Minh City and Hanoi" width="300" /></td>
  </tr>
  <tr>
    <th>City Detail · 24-hour format</th>
    <th>City Detail · 12-hour format</th>
  </tr>
  <tr>
    <td><img src="https://i.postimg.cc/xCWPXH8w/1795248733478-846140286607117484-1383753122617253414-eae549de5d39eb02f7726bc885efbbac.jpg" alt="Hanoi clock in 24-hour format with rolling seconds and daylight information" width="300" /></td>
    <td><img src="https://i.postimg.cc/65x0wdDj/1795248733489-846140286607117484-1383753122617253414-feb77e81c34b64f0eb725efb812cd37a.jpg" alt="Hanoi clock in 12-hour format with a PM indicator" width="300" /></td>
  </tr>
</table>

The supplied media is preserved as captured. The World Time and Search Cities screenshots show `UTC 0` labels for multiple cities; these labels are not a reference for the cities' actual UTC offsets.

## Getting Started

```sh
npm install
npm start
```

Scan the QR code with an Expo Go version compatible with SDK 58 on a phone connected to the same network. Use `npm run android` with an Android emulator, or `npm run web` to preview the app in a browser. The iOS Simulator requires macOS.

## Features and Navigation

- **World Time:** Tap a card to select a city, then tap the selected card again to open its clock. Use `Edit cities` to remove saved cities.
- **City Detail:** View an oversized clock, rolling seconds, the local date, and city-specific daylight information. The 12h/24h control changes the time format throughout the app. The button beside it switches to the flip-style clock inspired by the second design reference.
- **World Map:** Pan horizontally and tap a marker to select one of the available cities. The selected country is highlighted in black. Choose a UTC value on the scale to view a fixed-offset clock; this does not assign a city or apply daylight saving time. Tap `Return to…` to restore the geographic selection.
- **Search Cities:** Search the bundled collection of 16 cities. Tap the plus button to add a city or the checkmark to remove it. Tap a city name to open its clock.
- **Navigation:** The search button opens city search, the clock button opens city details, and the globe button switches between the map and saved-city list. The list button on City Detail returns to World Time.

Saved cities, the selected city, and the time format are persisted with AsyncStorage. Clocks refresh every second and when the app returns to the foreground. Animations respect the system's Reduce Motion setting.

## Project Structure

| File or directory | Purpose |
| --- | --- |
| `app/_layout.tsx` | Expo Router, safe areas, and shared context |
| `app/index.tsx` | Saved-city list |
| `app/city-detail.tsx` | Oversized clock and flip-style layout |
| `app/world-map.tsx` | World Map screen |
| `app/search.tsx` | City search, addition, and removal |
| `components/UI.tsx` | Design system, cards, headers, and navigation |
| `components/RollingClock.tsx` | Animated clock digits |
| `components/WorldMap.tsx` | Geographic SVG, markers, meridian, and UTC scale |
| `context/ClockContext.tsx` | Shared state, persistence, and foreground refresh |
| `services/time.ts` | Intl/IANA time calculations, UTC offsets, and SunCalc |
| `constants/cities.ts` | Coordinates and time zones for 16 cities |
| `assets/countries.json` | SVG paths for country boundaries |
| `scripts/build-map.mjs` | Map asset generation from World Atlas |
| `tests/time.test.ts` | Time-zone and daylight calculation tests |
| `scripts/check-ui.mjs` | Chrome/Playwright interaction checks |
| `docs/media/` | Demo video and four supplied screenshots |

## Technology Stack

Expo SDK 58, React Native, React, Expo Router, Reanimated, Worklets, Gesture Handler, React Native SVG, Safe Area Context, Screens, AsyncStorage, Expo Vector Icons, and SunCalc power the app. React Native Web provides the browser preview.

Development tools include TypeScript, tsx, Playwright, and Prettier. World Atlas, topojson-client, and d3-geo generate the map data. Exact dependency versions are recorded in `package-lock.json`.

## Validation

```sh
npm run typecheck
npm test
npx expo install --check
npx expo export --platform web
npx expo export --platform android --platform ios
```

For UI checks, run `npx expo start --web --port 8082`, followed by `node scripts/check-ui.mjs`. The script uses an installed Chrome browser and saves screenshots to `screenshots/`.

Previously completed checks:

- TypeScript validation passed without errors.
- All five logic tests passed.
- Web export and Android/iOS Hermes bundle exports succeeded.
- Chrome interaction checks covered navigation, 12/24-hour formats, the flip-style layout, UTC selection, search, adding/removing cities, and persistence.
- Browser screenshots were captured at 390 × 844 and 320 × 568 viewport sizes.

Native exports confirm that the bundles compile; they do not replace testing on physical devices. The supplied demo media documents the captured interface, rather than a complete device validation run.

## Sources and Scope

- **Map data:** [World Atlas](https://github.com/topojson/world-atlas), based on Natural Earth country boundaries at 1:110m resolution. The geographic data is in the public domain. The Mercator map is rendered with uniform scaling; it is a city-selection map, not a map of time-zone boundaries.
- **Runtime:** [Expo](https://docs.expo.dev/get-started/create-a-project/), with native dependency versions aligned to `expo/bundledNativeModules.json`.
- **City thumbnails:** Images load from Unsplash over the network. Clocks, search, daylight calculations, and map data work offline. Thumbnails retain a fallback background if an image cannot load.
- **Search coverage:** The offline collection contains 16 cities and does not use a global place-search API.
- **Device validation:** A full physical-device test pass on iOS and Android remains outstanding. Check animation and touch behavior in Expo Go on actual devices.
