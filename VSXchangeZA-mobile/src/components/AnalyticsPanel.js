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
  useValue,
  useComputedValue,
  LinearGradient,
  vec,
} from "@shopify/react-native-skia";

const { width } = Dimensions.get("window");

export default function AnalyticsPanel() {
  // ============================================================
  // Unified Shared Values — (Prevent redeclaration conflicts)
  // ============================================================
  const t = useSharedValue(0);
  const kpi = {
    users: useSharedValue(0),
    collabs: useSharedValue(0),
    projects: useSharedValue(0),
  };

  // ============================================================
  // Initialize cosmic animation
  // ============================================================
  useEffect(() => {
    t.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    kpi.users.value = withTiming(2450, { duration: 4000, easing: Easing.out(Easing.cubic) });
    kpi.collabs.value = withTiming(3860, { duration: 4500, easing: Easing.out(Easing.cubic) });
    kpi.projects.value = withTiming(1780, { duration: 4200, easing: Easing.out(Easing.cubic) });
  }, []);

  // ============================================================
  // Skia Wave Path
  // ============================================================
  const path = useComputedValue(() => {
    const amplitude = 30;
    const frequency = 4;
    const baseline = 80;
    const p = Skia.Path.Make();
    p.moveTo(0, baseline);

    for (let i = 0; i <= width; i++) {
      const y =
        baseline +
        Math.sin((i / width) * Math.PI * frequency + t.value * Math.PI * 2) *
          amplitude;
      p.lineTo(i, y);
    }

    return p;
  }, [t]);

  // ============================================================
  // KPI Animated Text Component
  // ============================================================
  const AnimatedText = ({ value, label, color }) => {
    const style = useAnimatedStyle(() => ({
      transform: [{ scale: 1 + Math.sin(t.value * Math.PI * 2) * 0.02 }],
    }));

    return (
      <Animated.View style={[styles.kpi, style]}>
        <Text style={[styles.kpiValue, { color }]}>{Math.round(value.value)}</Text>
        <Text style={styles.kpiLabel}>{label}</Text>
      </Animated.View>
    );
  };

  // ============================================================
  // Render Cosmic Analytics
  // ============================================================
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
        <AnimatedText value={kpi.users} label="Active Users" color="#1e90ff" />
        <AnimatedText value={kpi.collabs} label="Collaborations" color="#00f0a8" />
        <AnimatedText value={kpi.projects} label="Projects" color="#32cd32" />
      </View>
    </View>
  );
}

// ============================================================
// Styles — Cosmic Minimalism
// ============================================================
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