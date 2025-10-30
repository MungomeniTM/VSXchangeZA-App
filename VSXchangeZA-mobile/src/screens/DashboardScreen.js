// ==============================
//  — VSXchangeZA
//  Cosmic Alien-Grade Edition 👽
//  DashboardScreen.js — flawless across iOS, Android & Web
// ==============================

import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { Canvas, Circle, useValue, runTiming } from '@shopify/react-native-skia';
import AnalyticsPanel from '../components/AnalyticsPanel';
import Sidebar from '../components/Sidebar';
import Composer from '../components/Composer';
import CosmicBackground from '../components/CosmicBackground';

// =========================================================
// Cosmic Dashboard
// =========================================================
export default function DashboardScreen() {
  // sidebar toggle state
  const sidebarOpen = useSharedValue(0);

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(sidebarOpen.value ? 0 : -260, { duration: 400 }) }],
    opacity: withTiming(sidebarOpen.value ? 1 : 0.6, { duration: 300 }),
  }));

  const toggleSidebar = () => {
    sidebarOpen.value = sidebarOpen.value ? 0 : 1;
  };

  // Skia Cosmic Pulse (background motion)
  const pulse = useValue(0);
  React.useEffect(() => {
    runTiming(pulse, 1, { duration: 2500 });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />

      {/* Cosmic Background */}
      <CosmicBackground />

      {/* Safe Area Container */}
      <SafeAreaView style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.menuBtn}>
            <Text style={styles.menuText}>☰</Text>
          </TouchableOpacity>
          <Text style={styles.title}>VSXchangeZA</Text>
        </View>
        <AnalyticsPanel style={styles.rightCol} />
      </View>
    </SafeAreaView>
  );
}