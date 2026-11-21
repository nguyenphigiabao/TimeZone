import React, { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import Animated, {
  FadeInUp,
  FadeOutUp,
  ReduceMotion,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
const pad = (n: number) => String((n + 60) % 60).padStart(2, "0");
export function RollingSeconds({ value }: { value: string }) {
  const position = useSharedValue(0);
  useEffect(() => {
    position.value = 38;
    position.value = withTiming(0, {
      duration: 300,
      reduceMotion: ReduceMotion.System,
    });
  }, [value, position]);
  const motion = useAnimatedStyle(() => ({
    transform: [{ translateY: position.value }],
  }));
  return (
    <View style={s.window}>
      <Animated.View style={[s.reel, motion]}>
        <Text style={[s.digit, s.ghost]}>{pad(+value - 1)}</Text>
        <Text style={s.digit}>{value}</Text>
        <Text style={[s.digit, s.ghost]}>{pad(+value + 1)}</Text>
      </Animated.View>
    </View>
  );
}
export function FlipTile({ value, size }: { value: string; size: number }) {
  return (
    <View style={[s.tile, { width: size * 1.3, height: size * 1.12 }]}>
      <Animated.Text
        key={value}
        entering={FadeInUp.duration(300).reduceMotion(ReduceMotion.System)}
        exiting={FadeOutUp.duration(300).reduceMotion(ReduceMotion.System)}
        style={[s.flipDigit, { fontSize: size * 0.83 }]}
      >
        {value}
      </Animated.Text>
      <View pointerEvents="none" style={s.seam} />
    </View>
  );
}
const s = StyleSheet.create({
  window: { height: 114, width: 84, overflow: "hidden" },
  reel: { position: "absolute", top: 0, left: 0, right: 0 },
  digit: {
    fontSize: 42,
    lineHeight: 38,
    letterSpacing: -2,
    fontVariant: ["tabular-nums"],
    color: "#050505",
  },
  ghost: { opacity: 0.09 },
  tile: {
    backgroundColor: "#E3E3E3",
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  flipDigit: {
    position: "absolute",
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
    letterSpacing: 5,
    color: "#050505",
  },
  seam: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#f4f4f4",
  },
});
