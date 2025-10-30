// src/components/Sidebar.js
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import styles, { COLORS } from "../styles/dashboardStyles";
import MetricsCard from "./MetricsCard";

export default function Sidebar({ user, onCreatePost, onOpenSection, stats, onUseLocation }) {
  return (
    <ScrollView style={{ width: "100%" }}>
      <View style={styles.glass}>
        <View style={{ alignItems: "center", gap: 8 }}>
          <View style={{ width: 72, height: 72, borderRadius: 12, backgroundColor: "linear-gradient(270deg,#1e90ff,#00f0a8)", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontWeight: "800" }}>{(user?.firstName || "U").charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={{ color: COLORS.text, fontWeight: "800", marginTop: 6 }}>{user?.name || `${user?.firstName || "User"}`}</Text>
          <Text style={styles.smallMuted}>{user?.role || "—"} • {user?.location || "—"}</Text>
          <TouchableOpacity onPress={onCreatePost} style={{ marginTop: 8, backgroundColor: COLORS.blue, padding: 10, borderRadius: 8 }}>
            <Text style={{ color: "#061015", fontWeight: "800" }}>+ Create Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.glass, { marginTop: 12 }]}>
        <Text style={{ color: COLORS.text, fontWeight: "700", marginBottom: 8 }}>Quick Actions</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity style={{ padding: 8, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.01)" }} onPress={() => onOpenSection("skills")}>
            <Text style={styles.smallMuted}>Skills</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 8, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.01)" }} onPress={() => onOpenSection("listings")}>
            <Text style={styles.smallMuted}>Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 8, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.01)" }} onPress={() => onOpenSection("requests")}>
            <Text style={styles.smallMuted}>Requests</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.glass, { marginTop: 12 }]}>
        <Text style={{ color: COLORS.text, fontWeight: "700", marginBottom: 8 }}>Community Metrics</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <MetricsCard label="Users" value={stats?.users || "—"} />
          <MetricsCard label="Posts" value={stats?.posts || "—"} />
          <MetricsCard label="Farms" value={stats?.farms || "—"} />
        </View>
      </View>

      <View style={[styles.glass, { marginTop: 12 }]}>
        <Text style={{ color: COLORS.text, fontWeight: "700", marginBottom: 8 }}>Nearby Projects</Text>
        <TouchableOpacity onPress={onUseLocation} style={{ padding: 10, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.01)" }}>
          <Text style={styles.smallMuted}>Use my location</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}