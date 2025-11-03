// src/screens/DashboardScreen.js
// VSXchangeZA — DashboardScreen
// Cosmic Alien-Grade Edition: performant, robust, cross-platform.
// No Skia. Uses react-native-reanimated for subtle motion.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    transform: [{ translateX: withTiming(sidebarOpen.value ? 0 : -300, { duration: 360 }) }],
    opacity: withTiming(sidebarOpen.value ? 1 : 0.9, { duration: 300 }),
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
      {/* cosmic background behind everything */}
      <CosmicBackground />

      {/* header */}
      <Header title="VSXchangeZA" onMenuToggle={toggleSidebar} navigation={navigation} />

      <View style={styles.content}>
        {/* animated sidebar */}
        {!isNarrow && (
          <Animated.View style={[styles.sidebarWrap, sidebarStyle]} accessibilityLabel="sidebar">
            <Sidebar navigation={navigation} onCreatePost={() => { /* hook composer focus if needed */ }} />
          </Animated.View>
        )}

        {/* feed column */}
        <View style={styles.feedCol}>
          <Composer onPosted={() => loadPage(1, 12, false)} />

          {loading ? (
            <ActivityIndicator style={{ marginTop: 28 }} size="large" color="#00f0a8" />
          ) : (
            <FlatList
              data={listData}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              onEndReachedThreshold={0.6}
              onEndReached={onEndReached}
              ListFooterComponent={loadingMore ? <ActivityIndicator style={{ marginVertical: 16 }} /> : null}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00f0a8" />}
              contentContainerStyle={styles.feedList}
              removeClippedSubviews={Platform.OS === "android"} // performance hint
              initialNumToRender={6}
              maxToRenderPerBatch={8}
              windowSize={11}
              // Optional optimization if posts are fixed height:
              // getItemLayout={getItemLayout}
            />
          )}
        </View>

        {/* right column with analytics (hidden on narrow screens) */}
        {!isNarrow && (
          <View style={styles.rightCol} accessibilityLabel="analytics-panel">
            <AnalyticsPanel />
          </View>
        )}
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