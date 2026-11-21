import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Frame, Header, CityCard, styles } from "../components/UI";
import { useClock } from "../context/ClockContext";
import { cities } from "../constants/cities";
export default function WorldTime() {
  const { saved, selected, select, toggleSaved } = useClock();
  const [editing, setEditing] = useState(false);
  return (
    <Frame screen="list">
      <Header />
      {saved.length ? (
        <View>
          {saved.map((id) => {
            const city = cities.find((c) => c.id === id)!;
            return (
              <CityCard
                key={id}
                city={city}
                active={id === selected.id}
                onPress={() => {
                  if (selected.id === id) router.navigate("/city-detail");
                  else select(id);
                }}
                onRemove={editing ? () => toggleSaved(id) : undefined}
              />
            );
          })}
          <Pressable
            accessibilityRole="button"
            onPress={() => setEditing(!editing)}
            style={{
              alignSelf: "flex-end",
              paddingVertical: 12,
              paddingLeft: 20,
            }}
          >
            <Text style={styles.small}>{editing ? "Done" : "Edit cities"}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.title}>Your world,{"\n"}at a glance.</Text>
          <Text style={styles.body}>
            Add your first city with the + button.
          </Text>
        </View>
      )}
    </Frame>
  );
}
