// ==============================
// Sidebar.js — VSXchangeZA
// Quantum Sentient Edition 👽
// ==============================

import React, { useState } from "react";
import { View, Text, TouchableOpacity, Vibration } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import styles from "../styles/dashboardStyles";

export default function Sidebar({ style, navigation, onCreatePost }) {
  const [active, setActive] = useState(null);
  const pulse = useSharedValue(0);

  // ==============================
  // Subtle AI-like glow animation
  // ==============================
  const glowStyle = useAnimatedStyle(() => {
    const opacity = interpolate(pulse.value, [0, 1], [0.2, 0.9], Extrapolate.CLAMP);
    const scale = interpolate(pulse.value, [0, 1], [1, 1.05], Extrapolate.CLAMP);
    return {
      opacity,
      transform: [{ scale }],
      shadowColor: "#00fff5",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 15,
    };
  });

  // ==============================
  // Intelligent feedback
  // ==============================
  const handlePress = (target, route) => {
    setActive(target);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    pulse.value = withTiming(1, { duration: 200 }, () => {
      pulse.value = withTiming(0, { duration: 400 });
    });
    if (route) navigation?.navigate(route);
  };

  // ==============================
  // Render Sidebar
  // ==============================
  return (
    <Animated.View style={[styles.sidebarCard, glowStyle, style]}>
      {/* ========== User Card ========== */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>U</Text>
        </View>
        <View>
          <Text style={styles.hello}>
            Welcome, <Text style={styles.bold}>User</Text>
          </Text>
          <Text style={styles.mutedSmall}>Elite Builder • Earth Sector</Text>
        </View>
      </View>

      {/* ========== Create Button ========== */}
      <TouchableOpacity
        style={[styles.primaryBtn, { marginTop: 10 }]}
        onPress={() => {
          handlePress("create");
          onCreatePost?.();
        }}
        activeOpacity={0.9}
      >
        <Text style={styles.primaryBtnText}>+ Initiate Transmission</Text>
      </TouchableOpacity>

      {/* ========== Navigation Links ========== */}
      <View style={styles.sideLinks}>
        <Text style={styles.sideTitle}>My Dashboard</Text>

        {[
          { label: "My Skills", route: "Profile" },
          { label: "My Listings", route: "Listings" },
          { label: "Exchange Requests", route: "Requests" },
        ].map((item) => (
          <TouchableOpacity
            key={item.route}
            style={[
              styles.linkBtn,
              active === item.label && {
                backgroundColor: "rgba(0,255,245,0.08)",
                borderColor: "#00fff5",
                borderWidth: 1,
              },
            ]}
            onPress={() => handlePress(item.label, item.route)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.linkText,
                active === item.label && { color: "#00fff5", fontWeight: "600" },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}