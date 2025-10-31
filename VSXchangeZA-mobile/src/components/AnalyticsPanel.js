// ==============================
// AnalyticsPanel.js — VSXchangeZA
// Cosmic Alien-Grade Edition 👽 (No Skia)
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

const { width } = Dimensions.get("window");

export default function AnalyticsPanel() {
  // ============================================================
  // Shared values
  // ============================================================
  const t = useSharedValue(0);
  const kpi = {
    users: useSharedValue(0),
    collabs: useSharedValue(0),
    projects: useSharedValue(0),
  };

  // ============================================================
  // Initialize animations
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
  // Fake wave background (simple shimmer using opacity + scale)
  // ============================================================
  const waveStyle = useAnimatedStyle(() => ({
    opacity: 0.2 + Math.sin(t.value * Math.PI * 2) * 0.15,
    transform: [{ scaleX: 1 + Math.sin(t.value * Math.PI * 2) * 0.05 }],
  }));

  // ============================================================
  // Animated KPI text
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
  // Render
  // ============================================================
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics Overview</Text>

      <View style={styles.chartWrapper}>
        <Animated.View style={[styles.fakeWave, waveStyle]} />
      </View>

      <View style={styles.kpiRow}>
        <AnimatedText value={kpi.users} label="Active Users" color="#1e90ff" />
        <AnimatedText value={kpi.collabs} label="Collaborations" color="#00f0a8" />
        <AnimatedText value={kpi.projects} label="Projects" color="#32cd32" />
      </View>
    </View>
  );
}

// ============================================================
// Styles — clean cosmic minimalism
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
  chartWrapper: {
    width: "100%",
    height: 120,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  fakeWave: {
    width: width * 0.8,
    height: 80,
    backgroundColor: "linear-gradient(90deg, #1e90ff, #00f0a8, #32cd32)",
    borderRadius: 50,
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