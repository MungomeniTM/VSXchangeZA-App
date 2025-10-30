// ==============================
// AnalyticsPanel.js — VSXchangeZA
// Cosmic Alien-Grade Edition 👽
// ==============================

import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import {
  Canvas,
  Path,
  Skia,
  useSharedValueEffect,
  useValue,
  useComputedValue,
  LinearGradient,
  vec,
} from "@shopify/react-native-skia";

const { width } = Dimensions.get("window");

export default function AnalyticsPanel() {
  // ==============================
  // Cosmic Data Points
  // ==============================
  const t = useSharedValue(0);
  const kpi1 = useSharedValue(0);
  const kpi2 = useSharedValue(0);
  const kpi3 = useSharedValue(0);

  useEffect(() => {
    // Looping animation — smooth breathing wave
    t.value = withRepeat(withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }), -1, true);
    kpi1.value = withTiming(2450, { duration: 4000, easing: Easing.out(Easing.cubic) });
    kpi2.value = withTiming(3860, { duration: 4500, easing: Easing.out(Easing.cubic) });
    kpi3.value = withTiming(1780, { duration: 4200, easing: Easing.out(Easing.cubic) });
  }, []);

  // ==============================
  // Animated Path
  // ==============================
  const pathValue = useValue(0);
  const path = useComputedValue(() => {
    const amplitude = 30;
    const frequency = 4;
    const baseline = 80;
    const p = Skia.Path.Make();
    p.moveTo(0, baseline);

    for (let i = 0; i <= width; i++) {
      const y = baseline + Math.sin((i / width) * Math.PI * frequency + t.value * Math.PI * 2) * amplitude;
      p.lineTo(i, y);
    }

    return p;
  }, [t]);

  // ==============================
  // Animated KPI Values
  // ==============================
  const AnimatedText = ({ value, label, color }) => {
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: withTiming(1 + Math.sin(t.value * Math.PI * 2) * 0.02) }],
    }));
    return (
      <Animated.View style={[styles.kpi, animatedStyle]}>
        <Text style={[styles.kpiValue, { color }]}>{Math.round(value.value)}</Text>
        <Text style={styles.kpiLabel}>{label}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics Overview</Text>
      <Canvas style={styles.chart}>
        <Path path={path} style="stroke" strokeWidth={3}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, 0)}
            colors={["#1e90ff", "#00f0a8", "#32cd32"]}
          />
        </Path>
      </Canvas>

      <View style={styles.kpiRow}>
        <AnimatedText value={kpi1} label="Active Users" color="#1e90ff" />
        <AnimatedText value={kpi2} label="Collaborations" color="#00f0a8" />
        <AnimatedText value={kpi3} label="Projects" color="#32cd32" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 16,
    marginVertical: 10,
    shadowColor: "#00f0a8",
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  title: {
    color: "#e8e8ea",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  chart: {
    width: "100%",
    height: 120,
  },
  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 18,
  },
  kpi: {
    alignItems: "center",
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: "900",
  },
  kpiLabel: {
    fontSize: 12,
    color: "#9aa3ad",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});