// src/screens/DashboardScreen.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
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
// Cosmic Dashboard (No Skia)
// =========================================================
export default function DashboardScreen() {
  // Sidebar animation
  const sidebarOpen = useSharedValue(0);
  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(sidebarOpen.value ? 0 : -280, { duration: 350 }) }],
    opacity: withTiming(sidebarOpen.value ? 1 : 0.85, { duration: 300 }),
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header title="VSXchangeZA" onMenuToggle={toggleSidebar} navigation={navigation} />
      <View style={styles.content}>
        {/* Sidebar (animated) */}
        <Animated.View style={[styles.sidebarWrap, sidebarStyle]}>
          <Sidebar navigation={navigation} onCreatePost={() => { /* optional focus composer */ }} />
        </Animated.View>

        {/* Center feed */}
        <View style={styles.feedCol}>
          <Composer onPosted={load} />
          {loading ? (
            <ActivityIndicator style={{ marginTop: 24 }} />
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(p) => p._id || p.id || p._tempId}
              renderItem={({ item }) => (
                <PostCard
                  item={item}
                  onApprove={() => onApprove(item)}
                  onComment={() => navigation.navigate("PostComments", { postId: item._id || item.id })}
                  onShare={() => {/* implement share */}}
                />
              )}
              contentContainerStyle={{ paddingBottom: 120 }}
            />
          )}
        </View>

        {/* Right analytics — collapses on narrow devices */}
        <View style={styles.rightCol}>
          <AnalyticsPanel />
        </View>
      </View>
    </SafeAreaView>
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