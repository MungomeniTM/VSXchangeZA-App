// ============================================================
// CosmicBackground.js — VSXchangeZA
// Alien Nebula Matrix 👽 (No Skia, Pure Reanimated + RN)
// ============================================================

import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function CosmicBackground() {
  // ============================================================
  // Shared cosmic values (phase + pulse)
  // ============================================================
  const phase = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    // Infinite pulsing loop
    phase.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.linear) }),
      -1,
      false
    );

    glow.value = withRepeat(
      withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [phase, glow]);

  // ============================================================
  // Layers — nebula cores + shifting gradients
  // ============================================================

  const nebula1 = useAnimatedStyle(() => {
    const scale = interpolate(
      glow.value,
      [0, 1],
      [1, 1.4]
    );
    const opacity = interpolate(glow.value, [0, 1], [0.2, 0.5]);

    return {
      transform: [
        { translateX: Math.sin(phase.value * Math.PI * 2) * 30 },
        { translateY: Math.cos(phase.value * Math.PI * 2) * 20 },
        { scale },
      ],
      opacity,
    };
  });

  const nebula2 = useAnimatedStyle(() => {
    const scale = interpolate(glow.value, [0, 1], [1, 1.3]);
    const opacity = interpolate(glow.value, [0, 1], [0.15, 0.35]);

    return {
      transform: [
        { translateX: Math.cos(phase.value * Math.PI * 2) * 40 },
        { translateY: Math.sin(phase.value * Math.PI * 2) * 25 },
        { scale },
      ],
      opacity,
    };
  });

  const nebula3 = useAnimatedStyle(() => {
    const scale = interpolate(glow.value, [0, 1], [1, 1.5]);
    const opacity = interpolate(glow.value, [0, 1], [0.1, 0.3]);

    return {
      transform: [
        { translateX: Math.sin(phase.value * Math.PI * 4) * 50 },
        { translateY: Math.cos(phase.value * Math.PI * 2) * 30 },
        { scale },
      ],
      opacity,
    };
  });

  // ============================================================
  // Render — layers of shifting cosmic plasma
  // ============================================================
  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.nebula, styles.nebula1, nebula1]} />
      <Animated.View style={[styles.nebula, styles.nebula2, nebula2]} />
      <Animated.View style={[styles.nebula, styles.nebula3, nebula3]} />

      {/* Dim cosmic haze overlay */}
      <View style={styles.overlay} />
    </View>
  );
}

// ============================================================
// Styles — smooth alien atmosphere
// ============================================================
const styles = StyleSheet.create({
  nebula: {
    position: "absolute",
    borderRadius: 9999,
    blurRadius: 120,
  },
  nebula1: {
    width: width * 0.9,
    height: width * 0.9,
    backgroundColor: "rgba(0,255,255,0.25)",
    top: height * 0.05,
    left: -width * 0.25,
  },
  nebula2: {
    width: width * 0.7,
    height: width * 0.7,
    backgroundColor: "rgba(0,128,255,0.3)",
    bottom: height * 0.15,
    right: -width * 0.2,
  },
  nebula3: {
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: "rgba(255,0,128,0.2)",
    top: height * 0.35,
    left: width * 0.25,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,20,0.6)",
  },
});