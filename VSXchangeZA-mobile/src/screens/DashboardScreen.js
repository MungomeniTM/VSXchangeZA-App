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
  StatusBar,
  Alert,
  RefreshControl,
  useWindowDimensions,
  Platform,
} from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Composer from "../components/Composer";
import PostCard from "../components/PostCard";
import AnalyticsPanel from "../components/AnalyticsPanel";
import CosmicBackground from "../components/CosmicBackground";
import { fetchPosts } from "../api"; // keep your api.js as-is

// ---------- Utility: stable unique list ----------
function dedupeAndAttachTempId(items = []) {
  const seen = new Map();
  const out = [];
  for (const p of items) {
    const id = p._id || p.id || p._tempId || (p._localId || Math.random().toString(36).slice(2, 9));
    if (!seen.has(id)) {
      seen.set(id, true);
      // ensure stable temp id present
      out.push(Object.assign({}, p, { _tempId: id }));
    }
  }
  return out;
}

export default function DashboardScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const mountedRef = useRef(true);
  const isFetchingRef = useRef(false);

  const { width } = useWindowDimensions();
  const isNarrow = width < 900; // collapse right column on narrow widths

  // Sidebar animation
  const sidebarOpen = useSharedValue(0);
  const sidebarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(sidebarOpen.value ? 0 : -300, { duration: 360 }) }],
    opacity: withTiming(sidebarOpen.value ? 1 : 0.9, { duration: 300 }),
  }));

  const toggleSidebar = useCallback(() => {
    sidebarOpen.value = sidebarOpen.value ? 0 : 1;
  }, []);

  // ---------- Load posts (paginated) ----------
  const loadPage = useCallback(
    async (p = 1, size = 12, append = false) => {
      // prevent overlapping requests
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (p === 1 && !append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const res = await fetchPosts(); // your api function
        // Accept flexible response shapes: { data: { posts: [...] } } or array directly
        const items = res?.data?.posts || res?.data || res || [];
        const normalized = dedupeAndAttachTempId(Array.isArray(items) ? items : []);
        // If append, combine while preventing duplicates
        setPosts((prev) => {
          const combined = append ? [...prev, ...normalized] : normalized;
          return dedupeAndAttachTempId(combined);
        });

        // detect hasMore by length (server should return page sizes)
        setHasMore((normalized.length ?? 0) >= size);
        setPage(p + 1);
      } catch (err) {
        console.warn("Fetch posts failed:", err?.response?.data || err?.message || err);
        if (!append) Alert.alert("Error", "Unable to load feed right now.");
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setLoadingMore(false);
          setRefreshing(false);
        }
        isFetchingRef.current = false;
      }
    },
    []
  );

  // initial load
  useEffect(() => {
    mountedRef.current = true;
    loadPage(1, 12, false);
    return () => {
      mountedRef.current = false;
    };
  }, [loadPage]);

  // pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    await loadPage(1, 12, false);
  }, [loadPage]);

  // infinite scroll trigger
  const onEndReached = useCallback(() => {
    if (loadingMore || loading || !hasMore) return;
    // request next page (we pass page value)
    loadPage(page, 12, true);
  }, [loadingMore, loading, hasMore, page, loadPage]);

  // Approve optimistic update + API call
  const onApprove = useCallback(
    async (item) => {
      try {
        setPosts((prev) =>
          prev.map((p) => (p._id === item._id || p._tempId === item._tempId ? { ...p, approvals: (p.approvals || 0) + 1 } : p))
        );
        // dynamic import to avoid circular
        const apiModule = await import("../api");
        // prefer approvePost helper if available
        if (apiModule.approvePost) {
          await apiModule.approvePost(item._id || item.id);
        } else {
          // fallback: try hitting endpoint via createAPI
          const createAPI = apiModule.default || apiModule.createAPI;
          if (createAPI) {
            const api = await createAPI();
            await api.post(`/posts/${item._id || item.id}/approve`);
          }
        }
      } catch (err) {
        console.warn("Approve failed:", err);
        Alert.alert("Error", "Could not approve the post.");
      }
    },
    []
  );

  // Stable renderItem (memoized)
  const renderItem = useCallback(
    ({ item }) => {
      return (
        <PostCard
          item={item}
          onApprove={() => onApprove(item)}
          onComment={() => navigation?.navigate?.("PostComments", { postId: item._id || item.id })}
          onShare={() => {
            // simple share fallback
            Alert.alert("Share", `Share link: ${item._id ? `https://your.domain/posts/${item._id}` : "not available"}`);
          }}
        />
      );
    },
    [navigation, onApprove]
  );

  // getItemLayout optimization if your items are fixed height (approx). Comment out if variable.
  const getItemLayout = useCallback((_, index) => ({ length: 220, offset: 220 * index, index }), []);

  // key extractor
  const keyExtractor = useCallback((p) => p._id || p.id || p._tempId, []);

  // memoized list data to avoid re-renders
  const listData = useMemo(() => posts, [posts]);

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

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117" },
  content: {
    flex: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    // gap isn't supported across all RN versions; use margins in children instead
  },
  sidebarWrap: { width: 280, zIndex: 20, marginRight: 12 },
  feedCol: { flex: 1, minWidth: 300 },
  feedList: { paddingBottom: 120 },
  rightCol: { width: 340, marginLeft: 12 },
});