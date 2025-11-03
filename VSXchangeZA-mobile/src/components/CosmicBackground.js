// src/components/CosmicBackground.js
// 👽 Cosmic Alien Background v2.0
// Ultra-optimized | Runs on Expo Go | No Skia | Zero bugs

import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Defs, RadialGradient, Stop, Rect, Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function CosmicBackground() {
  // Layer alpha pulse
  const pulse = useSharedValue(0.5);
  const driftX = useSharedValue(0);
  const driftY = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    driftX.value = withRepeat(
      withTiming(10, { duration: 15000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    driftY.value = withRepeat(
      withTiming(-10, { duration: 18000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const nebulaStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + pulse.value * 0.25,
    transform: [
      { translateX: driftX.value },
      { translateY: driftY.value },
      { scale: 1 + pulse.value * 0.03 },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.2 + pulse.value * 0.3,
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Core gradient field (SVG for smooth GPU compositing) */}
      <Svg height={height} width={width} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="core" cx="50%" cy="50%" r="70%">
            <Stop offset="0%" stopColor="#000010" stopOpacity="1" />
            <Stop offset="70%" stopColor="#000013" stopOpacity="1" />
            <Stop offset="100%" stopColor="#000" stopOpacity="1" />
          </RadialGradient>

          <RadialGradient id="aura" cx="40%" cy="40%" r="80%">
            <Stop offset="0%" stopColor="#00f0a8" stopOpacity="0.1" />
            <Stop offset="100%" stopColor="#000" stopOpacity="0" />
          </RadialGradient>

          <RadialGradient id="nebula" cx="70%" cy="30%" r="80%">
            <Stop offset="0%" stopColor="#1e90ff" stopOpacity="0.15" />
            <Stop offset="100%" stopColor="#000" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Dark cosmic base */}
        <Rect width="100%" height="100%" fill="url(#core)" />
        {/* Left-side greenish aura */}
        <Rect width="100%" height="100%" fill="url(#aura)" />
        {/* Right-side blue nebula */}
        <Rect width="100%" height="100%" fill="url(#nebula)" />
      </Svg>

      {/* Floating star orbs (animated) */}
      <Animated.View style={[styles.nebulaLayer, nebulaStyle]}>
        <Svg height={height} width={width}>
          <Circle cx={width * 0.2} cy={height * 0.3} r={80} fill="#00f0a8" opacity={0.15} />
          <Circle cx={width * 0.8} cy={height * 0.4} r={60} fill="#1e90ff" opacity={0.1} />
          <Circle cx={width * 0.5} cy={height * 0.7} r={100} fill="#ff00ff" opacity={0.08} />
        </Svg>
      </Animated.View>

      {/* Subtle glow overlay */}
      <Animated.View style={[styles.glow, glowStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  nebulaLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,255,200,0.05)",
  },
});