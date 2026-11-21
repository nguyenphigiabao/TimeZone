import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import Svg, { Path, Line, Circle, Polygon, G } from "react-native-svg";
import { useReducedMotion } from "react-native-reanimated";
import { useClock } from "../context/ClockContext";
import { cities } from "../constants/cities";
import countries from "../assets/countries.json";
import { CityCard } from "./UI";
import { clock, offsetMinutes, utcLabel } from "../services/time";
import { router } from "expo-router";
const offsets = [
  ...new Set([
    ...Array.from({ length: 27 }, (_, i) => (i - 12) * 60),
    -570,
    -210,
    210,
    270,
    330,
    345,
    390,
    525,
    570,
    630,
    765,
  ]),
].sort((a, b) => a - b);
const mercY = (lat: number) =>
  150 -
  (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
export function WorldMap() {
  const { selected, select, now, twelve } = useClock();
  const { width, height } = useWindowDimensions();
  const viewport = Math.min(width, 480);
  const mapHeight = Math.max(300, Math.min(560, height - 380));
  const scale = mapHeight / 260;
  const worldWidth = 360 * scale;
  const scroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const utcScroll = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const reduced = useReducedMotion();
  const [fixed, setFixed] = useState<number | null>(null);
  const chosenOffset = fixed ?? offsetMinutes(now, selected.zone);
  useEffect(() => {
    setFixed(null);
    scroll.current?.scrollTo({
      x: Math.max(0, (selected.lon + 180) * scale - viewport / 2),
      animated: !reduced,
    });
  }, [selected.id, scale, viewport, reduced]);
  useEffect(() => {
    const index = offsets.indexOf(chosenOffset);
    if (index >= 0)
      utcScroll.current?.scrollTo({
        x: Math.max(0, index * 84 - viewport / 2 + 42),
        animated: !reduced,
      });
  }, [chosenOffset, viewport, reduced]);
  const x = (selected.lon + 180) * scale;
  const y = mercY(selected.lat) * scale;
  const fixedTime = clock(new Date(+now + (fixed ?? 0) * 60000), "UTC", twelve);
  return (
    <View>
      <View style={[s.map, { height: mapHeight }]}>
        <ScrollView
          ref={scroll}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ width: worldWidth, height: mapHeight }}
        >
          <Svg
            width={worldWidth}
            height={mapHeight}
            viewBox={`0 0 ${worldWidth} ${mapHeight}`}
          >
            <G scale={scale}>
              {countries.map((c) => (
                <Path
                  key={c.name}
                  d={c.d ?? ""}
                  fill={
                    fixed === null && c.id === selected.countryId
                      ? "#050505"
                      : "#858585"
                  }
                  stroke="#E8E8E8"
                  strokeWidth={0.35}
                />
              ))}
            </G>
            {cities.map((city) => (
              <G key={city.id}>
                <Circle
                  cx={(city.lon + 180) * scale}
                  cy={mercY(city.lat) * scale}
                  r={16}
                  fill="transparent"
                />
                <Circle
                  cx={(city.lon + 180) * scale}
                  cy={mercY(city.lat) * scale}
                  r={3}
                  fill="#E8E8E8"
                  stroke="#444"
                  strokeWidth={1}
                />
              </G>
            ))}
            {fixed === null && (
              <>
                <Line
                  x1={x}
                  x2={x}
                  y1={0}
                  y2={mapHeight}
                  stroke="#EF5555"
                  strokeWidth={1}
                />
                <Circle
                  cx={x}
                  cy={y}
                  r={5}
                  fill="#050505"
                  stroke="#EF5555"
                  strokeWidth={3}
                />
                <Polygon
                  points={`${x - 5},0 ${x + 5},0 ${x},9`}
                  fill="#EF5555"
                />
                <Polygon
                  points={`${x - 5},${mapHeight} ${x + 5},${mapHeight} ${x},${mapHeight - 9}`}
                  fill="#EF5555"
                />
              </>
            )}
          </Svg>
          {cities.map((city) => (
            <Pressable
              key={city.id}
              accessibilityRole="button"
              accessibilityLabel={`Select map city ${city.name}`}
              onPress={() => {
                setFixed(null);
                select(city.id);
              }}
              style={{
                position: "absolute",
                left: (city.lon + 180) * scale - 14,
                top: mercY(city.lat) * scale - 14,
                width: 28,
                height: 28,
                borderRadius: 14,
              }}
            />
          ))}
        </ScrollView>
        <View style={s.floating}>
          {fixed === null ? (
            <CityCard
              key={selected.id}
              city={selected}
              active
              onPress={() => router.navigate("/city-detail")}
            />
          ) : (
            <View style={s.fixedCard}>
              <View>
                <Text style={s.offset}>{utcLabel(fixed)}</Text>
                <Text style={s.fixedTitle}>Fixed offset</Text>
              </View>
              <Text style={s.time}>
                {fixedTime.hour}:{fixedTime.minute}
                {twelve ? ` ${fixedTime.period}` : ""}
              </Text>
            </View>
          )}
        </View>
      </View>
      <ScrollView
        ref={utcScroll}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.scale}
      >
        {offsets.map((offset) => (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: offset === chosenOffset }}
            accessibilityLabel={`Show ${utcLabel(offset)}`}
            key={offset}
            onPress={() => setFixed(offset)}
            style={s.tick}
          >
            <View style={s.tickLine} />
            <Text
              style={{
                fontSize: 12,
                color: offset === chosenOffset ? "#050505" : "#888",
              }}
            >
              {utcLabel(offset)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={s.mapHint}>
        <Text style={s.hint}>
          {fixed === null
            ? "Drag to explore · tap a city marker"
            : "Fixed UTC offset · daylight saving does not apply"}
        </Text>
        {fixed !== null && (
          <Pressable accessibilityRole="button" onPress={() => setFixed(null)}>
            <Text style={s.return}>Return to {selected.name}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  map: {
    backgroundColor: "#E8E8E8",
    overflow: "hidden",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  floating: { position: "absolute", bottom: 30, left: 28, right: 28 },
  scale: { borderTopWidth: 1, borderTopColor: "#ccc", height: 40 },
  tick: { width: 84, alignItems: "center" },
  tickLine: { height: 12, width: 1, backgroundColor: "#bbb", marginBottom: 6 },
  fixedCard: {
    minHeight: 98,
    backgroundColor: "#050505",
    borderRadius: 21,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  offset: { color: "#888", fontSize: 13, marginBottom: 5 },
  fixedTitle: { color: "#fff", fontSize: 16 },
  time: {
    color: "#fff",
    fontSize: 36,
    letterSpacing: -2,
    fontVariant: ["tabular-nums"],
  },
  mapHint: { alignItems: "center", gap: 8, paddingTop: 14 },
  hint: { fontSize: 10, color: "#777" },
  return: { fontSize: 12, color: "#050505" },
});
