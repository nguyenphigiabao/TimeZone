import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { Frame, Circle, DayIcon, enter } from "../components/UI";
import { RollingSeconds, FlipTile } from "../components/RollingClock";
import { useClock } from "../context/ClockContext";
import { clock, sun } from "../services/time";
export default function CityDetail() {
  const { now, selected, twelve, setTwelve } = useClock();
  const [flip, setFlip] = useState(false);
  const { width, height } = useWindowDimensions();
  const usable = Math.min(width, 480) - 56;
  const size = usable * 0.5;
  const t = clock(now, selected.zone, twelve);
  const solar = sun(now, selected);
  const weekday = new Intl.DateTimeFormat("en-GB", {
    timeZone: selected.zone,
    weekday: "short",
  }).format(now);
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: selected.zone,
    day: "numeric",
    month: "short",
  }).format(now);
  return (
    <Frame screen="clock">
      <View style={s.top}>
        <Circle
          icon="list"
          label="Saved cities"
          active
          size={44}
          onPress={() => router.navigate("/")}
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Pressable
            accessibilityLabel={
              flip ? "Large clock layout" : "Flip clock layout"
            }
            accessibilityRole="button"
            onPress={() => setFlip(!flip)}
            hitSlop={10}
          >
            <Feather name={flip ? "type" : "columns"} size={20} color="#777" />
          </Pressable>
          <View style={s.segment}>
            {[true, false].map((v) => (
              <Pressable
                key={String(v)}
                accessibilityRole="button"
                accessibilityLabel={v ? "12 hour format" : "24 hour format"}
                accessibilityState={{ selected: twelve === v }}
                onPress={() => setTwelve(v)}
                style={[s.option, twelve === v && s.active]}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: twelve === v ? "#fff" : "#050505",
                  }}
                >
                  {v ? "12h" : "24h"}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
      {flip ? (
        <Animated.View entering={enter} style={s.flip}>
          <Text style={s.flipDate}>
            {weekday}, {date} · {selected.name}
          </Text>
          {[t.hour, t.minute, t.second].map((v, i) => (
            <FlipTile
              key={i}
              value={v}
              size={Math.min(usable * 0.55, (height - 260) / 3.6)}
            />
          ))}
          {twelve && <Text>{t.period}</Text>}
        </Animated.View>
      ) : (
        <Animated.View entering={enter}>
          <View style={[s.clock, { marginTop: height < 740 ? 28 : 46 }]}>
            <View style={s.row}>
              <Text
                style={[s.big, { fontSize: size, lineHeight: size * 1.02 }]}
              >
                {t.hour}
              </Text>
              <View style={s.date}>
                <Text style={[s.dateText, { fontSize: usable * 0.087 }]}>
                  {weekday},
                </Text>
                <Text style={[s.dateText, { fontSize: usable * 0.087 }]}>
                  {date}
                </Text>
                {twelve && <Text style={s.period}>{t.period}</Text>}
              </View>
            </View>
            <View style={s.row}>
              <Text
                style={[s.big, { fontSize: size, lineHeight: size * 1.02 }]}
              >
                {t.minute}
              </Text>
              <View style={s.seconds}>
                <RollingSeconds value={t.second} />
              </View>
            </View>
          </View>
          <View style={s.place}>
            <View
              style={[
                s.sun,
                selected.id === "la" && {
                  position: "absolute",
                  right: 0,
                  top: 10,
                  zIndex: 1,
                },
              ]}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                <Text style={s.sunText}>Sun</Text>
                <DayIcon day={solar.day} />
                <Text style={s.sunText}>{solar.duration}</Text>
              </View>
              <Text style={[s.sunText, { marginTop: 5 }]}>{solar.range}</Text>
            </View>
            <Text
              style={[
                s.placeText,
                { fontSize: usable * 0.165, lineHeight: usable * 0.18 },
              ]}
            >
              {selected.name === "Los Angeles" ? "Los\nAngeles" : selected.name}
              ,{"\n"}
              {selected.region ? selected.region + ",\n" : ""}
              {selected.country}
            </Text>
          </View>
        </Animated.View>
      )}
    </Frame>
  );
}
const s = StyleSheet.create({
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },
  segment: {
    flexDirection: "row",
    padding: 3,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  option: { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 30 },
  active: { backgroundColor: "#050505" },
  clock: { marginBottom: 30 },
  row: { flexDirection: "row", alignItems: "center" },
  big: {
    width: "63%",
    fontWeight: "400",
    letterSpacing: -10,
    fontVariant: ["tabular-nums"],
    color: "#050505",
  },
  date: { flex: 1, gap: 5, paddingLeft: 3 },
  dateText: { letterSpacing: -1, color: "#050505" },
  period: { fontSize: 14, color: "#777" },
  seconds: { paddingLeft: 5 },
  place: { position: "relative" },
  placeText: { fontWeight: "400", letterSpacing: -1.8, color: "#050505" },
  sun: { alignSelf: "flex-end", marginBottom: 12 },
  sunText: { fontSize: 12, color: "#222" },
  flip: { alignItems: "center", gap: 20, paddingTop: 35 },
  flipDate: { fontSize: 16, textAlign: "center", marginBottom: 4 },
});
