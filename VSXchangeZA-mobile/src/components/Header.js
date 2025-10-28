// src/components/Header.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function Header({ title, onLogout }) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {onLogout ? <TouchableOpacity onPress={onLogout}><Text style={styles.logout}>Logout</Text></TouchableOpacity> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomColor: "#111827", borderBottomWidth: 1, backgroundColor: "#0d1117" },
  title: { color: "#fff", fontWeight: "800", fontSize: 18 },
  logout: { color: "#00C851", fontWeight: "700" }
});