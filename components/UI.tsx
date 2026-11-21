import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated";
import { useClock } from "../context/ClockContext";
import { cities, City } from "../constants/cities";
import { clock, offsetMinutes, sun, utcLabel } from "../services/time";
export const colors = {
  bg: "#EAEAEA",
  ink: "#050505",
  muted: "#777777",
  white: "#FFFFFF",
  red: "#EF5555",
};
export const enter = FadeIn.duration(250).reduceMotion(ReduceMotion.System);
type Icon = React.ComponentProps<typeof Feather>["name"];
export function Circle({
  icon,
  onPress,
  active = false,
  label,
  size = 56,
}: {
  icon: Icon;
  onPress: () => void;
  active?: boolean;
  label: string;
  size?: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.circle,
        {
          width: size,
          height: size,
          backgroundColor: active ? "#050505" : "#fff",
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
      ]}
    >
      <Feather
        name={icon}
        size={size < 50 ? 21 : 23}
        color={active ? "#fff" : "#666"}
      />
    </Pressable>
  );
}
export function Frame({
  children,
  screen,
  scroll = true,
}: {
  children: React.ReactNode;
  screen: "list" | "clock" | "map" | "search";
  scroll?: boolean;
}) {
  const { error } = useClock();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.frame}>
        {scroll ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={{ flex: 1 }}>{children}</View>
        )}
        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
        <View style={styles.nav}>
          <Circle
            icon="search"
            label="Search cities"
            active={screen === "search"}
            onPress={() => router.navigate("/search")}
          />
          <Circle
            icon="clock"
            label="City clock"
            active={screen === "clock"}
            onPress={() => router.navigate("/city-detail")}
          />
          <Circle
            icon="globe"
            label={screen === "map" ? "Show saved cities" : "World map"}
            active={screen === "map" || screen === "list"}
            onPress={() =>
              router.navigate(screen === "map" ? "/" : "/world-map")
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
export function Header({ map = false }: { map?: boolean }) {
  const { saved, select } = useClock();
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.thumbs}>
          {saved.slice(0, 5).map((id) => {
            const city = cities.find((c) => c.id === id)!;
            return (
              <Pressable
                key={id}
                accessibilityLabel={`Select ${city.name}`}
                onPress={() => select(id)}
              >
                <Image
                  source={{
                    uri: `https://images.unsplash.com/${city.photo}?auto=format&fit=crop&w=100&q=75`,
                  }}
                  style={styles.thumb}
                />
              </Pressable>
            );
          })}
        </View>
        <Circle
          icon="plus"
          size={44}
          label="Add a city"
          onPress={() => router.navigate("/search")}
        />
      </View>
      <View style={styles.titleRow}>
        <Text style={styles.title}>World Time</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={map ? "Show city list" : "Show world map"}
          onPress={() => router.navigate(map ? "/" : "/world-map")}
          hitSlop={12}
        >
          <Feather name={map ? "list" : "map"} size={22} color="#777" />
        </Pressable>
      </View>
    </View>
  );
}
export function DayIcon({ day }: { day: boolean }) {
  return (
    <Animated.View entering={enter} key={day ? "sun" : "moon"}>
      <Feather
        name={day ? "sun" : "moon"}
        size={18}
        color={day ? "#D8AD3A" : "#CCB45C"}
      />
    </Animated.View>
  );
}
export function CityCard({
  city,
  active = false,
  onPress,
  onRemove,
  seconds = false,
}: {
  city: City;
  active?: boolean;
  onPress: () => void;
  onRemove?: () => void;
  seconds?: boolean;
}) {
  const { now, twelve } = useClock();
  const t = clock(now, city.zone, twelve);
  const daylight = sun(now, city).day;
  const { width } = useWindowDimensions();
  return (
    <Animated.View
      layout={LinearTransition.duration(220).reduceMotion(ReduceMotion.System)}
      entering={enter}
      exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${city.name}, ${t.hour}:${t.minute}. ${active ? "Open clock" : "Select city"}`}
        accessibilityState={{ selected: active }}
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: active ? "#050505" : "#E6E6E6",
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.offset}>
            {utcLabel(offsetMinutes(now, city.zone))}
          </Text>
          <Text
            numberOfLines={1}
            style={[styles.cityName, active && { color: "#fff" }]}
          >
            {city.name}
          </Text>
        </View>
        <View style={styles.cardTimeWrap}>
          <Text
            style={[
              styles.cardTime,
              { fontSize: width < 360 ? 36 : 44 },
              active && { color: "#fff" },
            ]}
          >
            {t.hour}:{t.minute}
            {seconds ? `:${t.second}` : ""}
          </Text>
          {twelve && (
            <Text style={[styles.period, active && { color: "#aaa" }]}>
              {t.period}
            </Text>
          )}
        </View>
        <View style={styles.day}>
          <DayIcon day={daylight} />
        </View>
      </Pressable>
      {onRemove && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${city.name}`}
          onPress={onRemove}
          style={styles.remove}
        >
          <Feather name="minus-circle" size={19} color="#777" />
        </Pressable>
      )}
    </Animated.View>
  );
}
export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  frame: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center" },
  content: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 20,
    flexGrow: 1,
  },
  circle: {
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  nav: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 14,
    paddingBottom: 20,
    gap: 1,
  },
  header: { paddingTop: 8, paddingBottom: 25 },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 29,
  },
  thumbs: { flexDirection: "row", paddingLeft: 1 },
  thumb: {
    width: 40,
    height: 42,
    borderRadius: 11,
    marginLeft: -1,
    backgroundColor: "#ccc",
    borderWidth: 1,
    borderColor: colors.bg,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 36,
    fontWeight: "400",
    letterSpacing: -1.2,
    color: colors.ink,
  },
  card: {
    minHeight: 98,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 22,
    paddingVertical: 23,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  offset: { fontSize: 13, color: "#888", marginBottom: 4 },
  cityName: { fontSize: 18, color: colors.ink, letterSpacing: -0.3 },
  cardTimeWrap: { alignItems: "flex-end" },
  cardTime: {
    fontSize: 44,
    letterSpacing: -2.5,
    fontVariant: ["tabular-nums"],
    fontWeight: "400",
    color: colors.ink,
  },
  period: { fontSize: 10, color: "#777" },
  day: { position: "absolute", right: 12, top: 9 },
  remove: { position: "absolute", left: -22, top: 38 },
  error: { fontSize: 12, textAlign: "center", color: "#777", padding: 5 },
  small: { fontSize: 12, color: "#777" },
  empty: { paddingVertical: 60, gap: 12 },
  body: { fontSize: 16, color: "#777", lineHeight: 24 },
});
