// src/screens/DashboardScreen.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Composer from "../components/Composer";
import PostCard from "../components/PostCard";
import AnalyticsPanel from "../components/AnalyticsPanel";
import { fetchPosts } from "../api"; // you said keep your api.js

export default function DashboardScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // sidebar open state (animated)
  const sidebarOpen = useSharedValue(0);
  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(sidebarOpen.value ? 0 : -280, { duration: 350 }) }],
    opacity: withTiming(sidebarOpen.value ? 1 : 0.85, { duration: 300 }),
  }));

  const toggleSidebar = () => { sidebarOpen.value = sidebarOpen.value ? 0 : 1; };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPosts();
      const items = res?.data?.posts || res?.data || [];
      // dedupe & stable keys
      const seen = new Map();
      const unique = [];
      for (const p of items) {
        const id = p._id || p.id || (p._tempId || Math.random().toString(36).slice(2,9));
        if (!seen.has(id)) { seen.set(id, true); unique.push({...p, _tempId: id}); }
      }
      setPosts(unique);
    } catch (err) {
      console.warn("Fetch posts failed:", err?.response?.data || err?.message || err);
      Alert.alert("Error", "Unable to load posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const sub = navigation?.addListener?.("focus", load);
    load();
    return sub;
  }, [navigation, load]);

  const onApprove = async (item) => {
    try {
      // optimistic locally
      setPosts(prev => prev.map(p => p._id === item._id ? { ...p, approvals: (p.approvals||0) + 1 } : p));
      // call API
      // your createAPI/approve call already exists elsewhere; keep as-is
      const apiModule = await import("../api"); // dynamic import to avoid circularities
      await apiModule.approvePost(item._id || item.id);
    } catch (err) {
      console.warn(err);
      Alert.alert("Error", "Could not approve.");
    }
  };

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117" },
  content: { flex: 1, flexDirection: "row", gap: 12, padding: 12 },
  sidebarWrap: { width: 280, zIndex: 20 },
  feedCol: { flex: 1 },
  rightCol: { width: 340 },
});