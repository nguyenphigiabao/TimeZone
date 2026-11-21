import React from "react";
import { View } from "react-native";
import { Frame, Header } from "../components/UI";
import { WorldMap } from "../components/WorldMap";
export default function MapScreen() {
  return (
    <Frame screen="map">
      <Header map />
      <View style={{ marginHorizontal: -28 }}>
        <WorldMap />
      </View>
    </Frame>
  );
}
