// src/components/AnalyticsPanel.js
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";
import { LineChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

export default function AnalyticsPanel() {
  // Animated pulse using reanimated
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.06, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  // simplistic numeric animation for KPI counters (robust & portable)
  const [kpi1, setKpi1] = useState(0);
  const [kpi2, setKpi2] = useState(0);
  const [kpi3, setKpi3] = useState(0);

  useEffect(() => {
    // animate up to targets
    const target1 = 2450, target2 = 3860, target3 = 1780;
    let a=0, b=0, c=0;
    const t = setInterval(() => {
      a = Math.min(target1, a + Math.ceil(target1/40));
      b = Math.min(target2, b + Math.ceil(target2/40));
      c = Math.min(target3, c + Math.ceil(target3/40));
      setKpi1(a); setKpi2(b); setKpi3(c);
      if (a>=target1 && b>=target2 && c>=target3) clearInterval(t);
    }, 60);
    return () => clearInterval(t);
  }, []);

  const chartData = {
    labels: ["Jan","Feb","Mar","Apr","May","Jun"],
    datasets: [{ data: [12, 16, 24, 20, 28, 32] }],
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Data Analytics Preview</Text>

      <LineChart
        data={chartData}
        width={Math.min(width * 0.85, 480)}
        height={140}
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: "#071017",
          backgroundGradientTo: "#071017",
          decimalPlaces: 0,
          color: (opacity=1) => `rgba(0,240,168,${opacity})`,
          labelColor: () => "#9aa3ad",
          propsForDots: { r: "4", strokeWidth: "2", stroke: "#00f0a8" },
        }}
        style={{ borderRadius: 12, marginBottom: 12 }}
        bezier
        withShadow={true}
      />

      <Animated.View style={[styles.kpiRow, pulseStyle]}>
        <View style={styles.kpi}>
          <Text style={[styles.kpiValue, { color: "#1e90ff" }]}>{kpi1}</Text>
          <Text style={styles.kpiLabel}>Active Users</Text>
        </View>
        <View style={styles.kpi}>
          <Text style={[styles.kpiValue, { color: "#00f0a8" }]}>{kpi2}</Text>
          <Text style={styles.kpiLabel}>Collaborations</Text>
        </View>
        <View style={styles.kpi}>
          <Text style={[styles.kpiValue, { color: "#32cd32" }]}>{kpi3}</Text>
          <Text style={styles.kpiLabel}>Projects</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  title: { color: "#e8e8ea", fontWeight: "800", marginBottom: 8 },
  kpiRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  kpi: { alignItems: "center", flex: 1 },
  kpiValue: { fontWeight: "800", fontSize: 20 },
  kpiLabel: { fontSize: 12, color: "#9aa3ad", marginTop: 4, textTransform: "uppercase" },
});