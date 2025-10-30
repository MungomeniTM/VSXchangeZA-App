// src/components/FloatingActionButton.js
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles, { COLORS } from "../styles/dashboardStyles";

export default function FloatingActionButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.fab]}>
      <LinearGradient colors={[COLORS.mint, COLORS.green]} style={{ width: "100%", height: "100%", borderRadius: 999, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#061015", fontSize: 24, fontWeight: "900" }}>＋</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}