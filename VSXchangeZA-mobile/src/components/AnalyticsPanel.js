// src/components/AnalyticsPanel.js
import React, { useEffect, useState } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import styles, { COLORS } from "../styles/dashboardStyles";
import { getAnalytics } from "../api";

const W = Dimensions.get("window").width - 32;

export default function AnalyticsPanel() {
  const [data, setData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    series: [12, 18, 25, 22, 28],
  });
  const [kpis, setKpis] = useState({ k1: "—", k2: "—", k3: "—" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getAnalytics();
        if (!mounted) return;
        // expected structure: { labels: [], series: [], kpis: {k1,k2,k3}, stats: {users,posts,farms}}
        if (res?.data) {
          const dd = res.data;
          setData({
            labels: dd.labels || data.labels,
            series: dd.series || data.series,
          });
          setKpis(dd.kpis || kpis);
        }
      } catch (err) {
        // ignore (keep demo data)
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <View style={styles.analyticsCard}>
      <Text style={{ color: COLORS.text, fontWeight: "700", marginBottom: 8 }}>Data Analytics Preview</Text>

      <LineChart
        data={{
          labels: data.labels,
          datasets: [{ data: data.series }],
        }}
        width={W}
        height={150}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: COLORS.bg,
          backgroundGradientFrom: COLORS.bg,
          backgroundGradientTo: COLORS.bg,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0,240,168, ${opacity})`,
          labelColor: () => COLORS.muted,
          style: { borderRadius: 12 },
          propsForDots: { r: "4", strokeWidth: "2", stroke: COLORS.mint },
        }}
        bezier
        style={{ borderRadius: 12 }}
      />

      <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={{ color: COLORS.muted }}>Skill demand</Text>
          <Text style={{ color: COLORS.blue, fontWeight: "800" }}>{kpis.k1 || "—"}</Text>
        </View>
        <View>
          <Text style={{ color: COLORS.muted }}>Farm growth</Text>
          <Text style={{ color: COLORS.blue, fontWeight: "800" }}>{kpis.k2 || "—"}</Text>
        </View>
        <View>
          <Text style={{ color: COLORS.muted }}>Avg approvals</Text>
          <Text style={{ color: COLORS.blue, fontWeight: "800" }}>{kpis.k3 || "—"}</Text>
        </View>
      </View>
    </View>
  );
}