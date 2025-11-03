// src/components/CosmicBackground.js
import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";

export default function CosmicBackground() {
  const glow = useSharedValue(0.7);
  React.useEffect(() => {
    glow.value = withRepeat(withTiming(1, { duration: 4500, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value * 0.3 }));

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.layer, { backgroundColor: "#001019" }, glowStyle]} />
      <Animated.View style={[styles.circle, { backgroundColor: "#002033", right: 30, top: 80, opacity: 0.12 }]} />
      <Animated.View style={[styles.circle, { backgroundColor: "#003040", left: 20, top: 220, opacity: 0.1 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFillObject },
  circle: { position: "absolute", width: 220, height: 220, borderRadius: 110 },
});