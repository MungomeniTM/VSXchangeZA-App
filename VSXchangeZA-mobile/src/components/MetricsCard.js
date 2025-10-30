// src/components/MetricsCard.js
import React from "react";
import { View, Text } from "react-native";
import styles, { COLORS } from "../styles/dashboardStyles";

export default function MetricsCard({ label, value }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}