// src/components/CosmicBackground.js
import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";

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
  }, []);

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