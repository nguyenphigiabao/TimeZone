import React, { useState } from "react";
import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Frame, Circle, styles } from "../components/UI";
import { cities } from "../constants/cities";
import { useClock } from "../context/ClockContext";
import { offsetMinutes, utcLabel } from "../services/time";
const normalize = (v: string) =>
  v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export default function Search() {
  const [query, setQuery] = useState("");
  const { saved, toggleSaved, select, now } = useClock();
  const filtered = cities.filter((c) =>
    normalize(`${c.name} ${c.country} ${c.zone}`).includes(
      normalize(query.trim()),
    ),
  );
  return (
    <Frame screen="search">
      <View style={s.top}>
        <Text style={styles.title}>Search Cities</Text>
        <Circle
          icon="x"
          size={40}
          label="Back to saved cities"
          onPress={() => router.navigate("/")}
        />
      </View>
      <View style={s.inputWrap}>
        <Feather name="search" size={20} color="#777" />
        <TextInput
          accessibilityLabel="Search city or country"
          placeholder="City or country"
          placeholderTextColor="#888"
          value={query}
          onChangeText={setQuery}
          style={s.input}
          autoCorrect={false}
        />
        {!!query && (
          <Pressable
            accessibilityLabel="Clear search"
            onPress={() => setQuery("")}
          >
            <Feather name="x" size={18} />
          </Pressable>
        )}
      </View>
      <Text style={s.caption}>
        {filtered.length} CITIES · LOCAL TIMES, WORLDWIDE
      </Text>
      {filtered.map((city) => (
        <View key={city.id} style={s.result}>
          <Pressable
            style={{ flex: 1 }}
            accessibilityRole="button"
            accessibilityLabel={`View ${city.name}`}
            onPress={() => {
              select(city.id);
              router.navigate("/city-detail");
            }}
          >
            <Text style={s.name}>{city.name}</Text>
            <Text style={s.sub}>
              {city.country} · {utcLabel(offsetMinutes(now, city.zone))}
            </Text>
            <Text style={s.zone}>{city.zone}</Text>
          </Pressable>
          <Circle
            icon={saved.includes(city.id) ? "check" : "plus"}
            size={40}
            active={saved.includes(city.id)}
            label={`${saved.includes(city.id) ? "Remove" : "Add"} ${city.name}`}
            onPress={() => {
              toggleSaved(city.id);
              if (!saved.includes(city.id)) select(city.id);
            }}
          />
        </View>
      ))}
      {!filtered.length && (
        <View style={styles.empty}>
          <Text style={s.name}>No cities found.</Text>
          <Text style={styles.body}>
            Try another city or country in the offline collection.
          </Text>
        </View>
      )}
    </Frame>
  );
}
const s = StyleSheet.create({
  top: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 28,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 18,
  },
  input: { flex: 1, height: 56, fontSize: 17, color: "#050505" },
  caption: {
    fontSize: 10,
    letterSpacing: 1.3,
    color: "#777",
    marginTop: 26,
    marginBottom: 10,
  },
  result: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
    gap: 10,
  },
  name: { fontSize: 23, letterSpacing: -0.5 },
  sub: { fontSize: 13, color: "#777", marginTop: 5 },
  zone: { fontSize: 11, color: "#888", marginTop: 4 },
});
