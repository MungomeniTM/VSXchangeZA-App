import React, { useEffect, useRef } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Canvas, Skia, useValue, runTiming, vec, Circle, useComputedValue } from "@shopify/react-native-skia";
import styles from "../styles/dashboardStyles";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsPanel() {
  // small skia pulse behind KPIs
  const t = useValue(0);
  useEffect(() => {
    runTiming(t, 1, { duration: 3000, easing: Skia.Easing.inOut(Skia.Easing.cubic) }, () => {
      t.current = 0;
      // loop
      runTiming(t, 1, { duration: 3000 }, () => {});
    });
  }, []);

  const pulse = useComputedValue(() => 1 + Math.sin((t.current || 0) * Math.PI * 2) * 0.08, [t]);

  const data = {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets: [{ data: [20,45,28,80,99,43,65], strokeWidth: 2 }]
  };

  return (
    <View style={styles.analyticsCard}>
      <Text style={styles.analyticsTitle}>Data Analytics Preview</Text>
      <LineChart
        data={data}
        width={screenWidth * 0.28}
        height={160}
        chartConfig={{
          backgroundGradientFrom: "#0b0c0f",
          backgroundGradientTo: "#0b0c0f",
          color: (opacity = 1) => `rgba(0,240,168,${opacity})`,
          strokeWidth: 2,
          decimalPlaces: 0,
          useShadowColorFromDataset: false,
        }}
        bezier
        style={{ borderRadius: 12, marginBottom: 12 }}
      />

      <View style={styles.kpiRow}>
        <View style={styles.kpi}>
          <Text style={styles.kpiValue}>↑ 42%</Text>
          <Text style={styles.kpiLabel}>Skill demand</Text>
        </View>
        <View style={styles.kpi}>
          <Text style={styles.kpiValue}>↑ 18%</Text>
          <Text style={styles.kpiLabel}>Farm growth</Text>
        </View>
        <View style={styles.kpi}>
          <Text style={styles.kpiValue}>120+</Text>
          <Text style={styles.kpiLabel}>Avg approvals</Text>
        </View>
      </View>

      <Canvas style={{ height: 40, width: "100%" }}>
        <Circle cx={50} cy={20} r={10} color="#00f0a8" opacity={0.08} transform={[{ scale: pulse }]} />
      </Canvas>
    </View>
  );
}