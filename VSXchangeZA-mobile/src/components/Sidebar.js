// ==============================
// Sidebar.js — VSXchangeZA
// Cosmic Alien-Grade Edition 👽
// ==============================

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/dashboardStyles";

export default function Sidebar({ style, navigation, onCreatePost }) {
  return (
    <View style={[styles.sidebarCard, style]}>
      {/* ========== User Card ========== */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>U</Text>
        </View>
        <View>
          <Text style={styles.hello}>
            Welcome, <Text style={styles.bold}>User</Text>
          </Text>
          <Text style={styles.mutedSmall}>Role • Location</Text>
        </View>
      </View>

      {/* ========== Create Button ========== */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={onCreatePost}
        activeOpacity={0.8}
      >
        <Text style={styles.primaryBtnText}>+ Create Post</Text>
      </TouchableOpacity>

      {/* ========== Navigation Links ========== */}
      <View style={styles.sideLinks}>
        <Text style={styles.sideTitle}>My Dashboard</Text>

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation?.navigate("Profile")}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>My Skills</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation?.navigate("Listings")}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>My Listings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={() => navigation?.navigate("Requests")}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>Exchange Requests</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}