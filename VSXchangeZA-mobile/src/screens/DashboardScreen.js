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
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
} from 'react-native-reanimated';
import AnalyticsPanel from '../components/AnalyticsPanel';
import Sidebar from '../components/Sidebar';
import Composer from '../components/Composer';
import CosmicBackground from '../components/CosmicBackground';

// =========================================================
// Cosmic Dashboard (No Skia)
// =========================================================
export default function DashboardScreen() {
  // Sidebar animation
  const sidebarOpen = useSharedValue(0);

  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(sidebarOpen.value ? 0 : -260, { duration: 400 }) },
    ],
    opacity: withTiming(sidebarOpen.value ? 1 : 0.6, { duration: 300 }),
  }));

  const toggleSidebar = () => {
    sidebarOpen.value = sidebarOpen.value ? 0 : 1;
  };

  // Cosmic pulse animation (background shimmer)
  const pulse = useSharedValue(0.5);

  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 2500 }), -1, true);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: pulse.value * 1.1 }],
  }));

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />

      {/* Cosmic Background Layer */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: 'rgba(0,255,255,0.05)' },
          pulseStyle,
        ]}
      />

      {/* Safe Area */}
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

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <AnalyticsPanel />
        </ScrollView>

        {/* Composer */}
        <Composer />
      </SafeAreaView>
    </View>
  );
}

// =========================================================
// Styles — sleek alien polish
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