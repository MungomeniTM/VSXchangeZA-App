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
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { Canvas, Circle, useSharedValue as useSkiaValue, runTiming } from '@shopify/react-native-skia';
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
  const pulse = useSkiaValue(0);
  React.useEffect(() => {
    runTiming(pulse, 1, { duration: 2500 });
  }, [pulse]);

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

        {/* Sidebar */}
        <Animated.View style={[styles.sidebarContainer, sidebarStyle]}>
          <Sidebar onClose={toggleSidebar} />
        </Animated.View>

        {/* Main Scrollable Feed */}
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <AnalyticsPanel />
        </ScrollView>

        {/* Composer — for new posts or insights */}
        <Composer />
      </SafeAreaView>

      {/* Skia Layer — cosmic pulse animation */}
      <Canvas style={StyleSheet.absoluteFill}>
        <Circle cx={200} cy={400} r={120 * pulse.current} color="rgba(0,255,255,0.1)" />
      </Canvas>
    </View>
  );
}

// =========================================================
// Styles — minimal alien polish
// =========================================================
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    color: '#00FFFF',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  menuBtn: {
    padding: 6,
  },
  menuText: {
    color: '#00FFFF',
    fontSize: 24,
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  sidebarContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    bottom: 0,
    width: 260,
    zIndex: 10,
  },
});