// src/screens/DashboardScreen.js
// ==========================================================
// VSXchangeZA — DashboardScreen
// Cosmic / Alien-grade, Vector-Icons integrated, no Skia
// Futuristic 0.1% full-stack architecture
// ==========================================================

import React, { useCallback, useEffect, useState, useRef } from "react";
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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPosts();
      const items = res?.data?.posts || res?.data || [];
      const uniq = uniqueById(items);
      if (!mounted.current) return;
      setPosts(uniq);
    } catch (err) {
      console.warn("Fetch posts failed:", err);
      Alert.alert("Error", "Unable to load posts.");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    load();
    const sub = navigation?.addListener?.("focus", load);
    return () => {
      mounted.current = false;
      sub?.();
    };
  }, [navigation, load]);

  const toggleSidebar = useCallback(() => {
    sidebarOpen.value = sidebarOpen.value ? 0 : 1;
  };

  // Skia Cosmic Pulse (background motion)
  const pulse = useValue(0);
  React.useEffect(() => {
    runTiming(pulse, 1, { duration: 2500 });
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

  const bgStyle = useAnimatedStyle(() => ({
    opacity: 1,
    transform: [{ translateY: shift.value * 40 }],
  }));

  // -------------------- Render --------------------
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 🌌 Animated cosmic background */}
      <Animated.View style={[StyleSheet.absoluteFill, bgStyle]}>
        <LinearGradient
          colors={["#000010", "#00121F", "#000A12"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={["#00f0a822", "#00556611", "#00000000"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Main Content */}
      <Header
        title="VSXplore"
        onMenuToggle={toggleSidebar}
        navigation={navigation}
        onTitlePress={() => setExploreOpen(true)}
      />

      <View style={styles.body}>
        <Animated.View style={[styles.sidebar, sidebarAnim]}>
          <Sidebar
            navigation={navigation}
            onCreatePost={() => navigation?.navigate?.("CreatePost")}
          />
        </Animated.View>

        <View style={styles.main}>
          <Composer onPosted={load} />

          {loading ? (
            <ActivityIndicator
              style={{ marginTop: 30 }}
              size="large"
              color="#00f0a8"
            />
          ) : (
            <FlatList
              data={filteredPosts}
              renderItem={({ item }) => (
                <PostCard
                  item={item}
                  onApprove={() => onApprove(item)}
                  onComment={() =>
                    navigation?.navigate?.("PostComments", {
                      postId: item._id || item.id,
                    })
                  }
                  onShare={() =>
                    Alert.alert(
                      "Share",
                      `Share link: ${item._id || item.id || "—"}`
                    )
                  }
                />
              )}
              keyExtractor={(p) => p._id || p.id || p._tempId}
              contentContainerStyle={styles.feedContainer}
            />
          )}
        </View>

        {!isNarrow ? (
          <View style={styles.right}>
            <LeftQuickList />
          </View>
        ) : null}
      </View>

      <BottomNav />
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