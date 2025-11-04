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
  StatusBar,
  Alert,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  useWindowDimensions,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Ionicons";

// 🪐 ADD: cosmic gradient import
import { LinearGradient } from "expo-linear-gradient";

import Header from "../components/Header";
import Composer from "../components/Composer";
import PostCard from "../components/PostCard";
import AnalyticsPanel from "../components/AnalyticsPanel";
import Sidebar from "../components/Sidebar";
import { fetchPosts, approvePost } from "../api";

// --------------------
// Utilities
// --------------------
function uniqueById(items = []) {
  const map = new Map();
  for (const p of items) {
    const id =
      p._id || p.id || p._tempId || Math.random().toString(36).slice(2, 9);
    if (!map.has(id)) map.set(id, { ...p, _tempId: id });
  }
  return Array.from(map.values());
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// --------------------
// Skill set
// --------------------
const SKILLS = [
  "Carpentry",
  "Electrical",
  "Plumbing",
  "Painting",
  "Cleaning",
  "Mechanics",
  "Farming",
  "Equipment",
  "Analytics",
  "Collaborate",
];

// --------------------
// DashboardScreen
// --------------------
export default function DashboardScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const isNarrow = width < 760;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const sidebarOpen = useSharedValue(isNarrow ? 0 : 1);
  const sidebarAnim = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(sidebarOpen.value ? 0 : -300, {
          duration: 360,
          easing: Easing.out(Easing.cubic),
        }),
      },
    ],
    opacity: withTiming(sidebarOpen.value ? 1 : 0.9, { duration: 260 }),
  }));

  const [exploreOpen, setExploreOpen] = useState(false);
  const [skillQuery, setSkillQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [fabOpen, setFabOpen] = useState(false);

  const rotation = useSharedValue(0);
  const fabStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${withSpring(rotation.value, {
          damping: 12,
          stiffness: 120,
        })}deg`,
      },
    ],
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

  const toggleSidebar = () => {
    sidebarOpen.value = sidebarOpen.value ? 0 : 1;
  };

  const onApprove = async (item) => {
    try {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === item._id
            ? { ...p, approvals: (p.approvals || 0) + 1 }
            : p
        )
      );
      if (approvePost) await approvePost(item._id || item.id);
    } catch (err) {
      console.warn("approve error:", err);
      Alert.alert("Error", "Could not approve.");
      load();
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (!activeFilters.size) return true;
    const userSkills = (p.user?.skills || p.skills || []).map((s) =>
      String(s || "").toLowerCase()
    );
    for (const f of activeFilters) {
      if (
        userSkills.includes(String(f).toLowerCase()) ||
        (p.tags || [])
          .map((t) => String(t).toLowerCase())
          .includes(String(f).toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  });

  const skillHits = SKILLS.filter((s) =>
    s.toLowerCase().includes(skillQuery.trim().toLowerCase())
  );

  // -------------------- Bottom Navigation --------------------
  const BottomNav = () => (
    <View style={styles.bottomNavWrap}>
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => navigation?.navigate?.("Dashboard")}
        >
          <Icon name="home-outline" size={24} color="#00f0a8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => setExploreOpen(true)}
        >
          <Icon name="search-outline" size={24} color="#00f0a8" />
        </TouchableOpacity>

        <View style={{ width: 56 }} />

        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => navigation?.navigate?.("Messages")}
        >
          <Icon name="chatbubble-ellipses-outline" size={24} color="#00f0a8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomBtn}
          onPress={() => navigation?.navigate?.("Profile")}
        >
          <Icon name="person-outline" size={24} color="#00f0a8" />
        </TouchableOpacity>
      </View>

      {/* Floating Action Button */}
      <Animated.View style={[styles.fab, fabStyle]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            rotation.value += 45;
            setFabOpen((v) => !v);
            navigation?.navigate?.("CreatePost");
          }}
        >
          <Icon name="add-circle" size={64} color="#00f0a8" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  // -------------------- Quick Access Section --------------------
  const LeftQuickList = () => (
    <View accessible style={styles.leftQuick}>
      <TouchableOpacity
        style={styles.quickItem}
        onPress={() => navigation?.navigate?.("Analytics")}
      >
        <Icon name="analytics-outline" size={18} color="#00f0a8" />
        <Text style={styles.quickLabel}> Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickItem}
        onPress={() => navigation?.navigate?.("Farms")}
      >
        <Icon name="leaf-outline" size={18} color="#00f0a8" />
        <Text style={styles.quickLabel}> Farms</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickItem}
        onPress={() => navigation?.navigate?.("Collaborate")}
      >
        <Icon name="people-outline" size={18} color="#00f0a8" />
        <Text style={styles.quickLabel}> Collaborate</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickItem}
        onPress={() => navigation?.navigate?.("Equipment")}
      >
        <Icon name="construct-outline" size={18} color="#00f0a8" />
        <Text style={styles.quickLabel}> Equipment</Text>
      </TouchableOpacity>
    </View>
  );

  // -------------------- ✨ Cosmic Background Animation --------------------
  const shift = useSharedValue(0);
  useEffect(() => {
    const loop = () => {
      shift.value = withTiming(1, { duration: 8000, easing: Easing.linear }, () => {
        shift.value = 0;
        loop();
      });
    };
    loop();
  }, []);

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

// --------------------
// Styles (Intergalactic Polish)
// --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#061015" },
  body: { flex: 1, flexDirection: "row" },
  sidebar: { width: 280, zIndex: 20, padding: 8 },
  main: { flex: 1, paddingHorizontal: 12 },
  feedContainer: { paddingBottom: clamp(140, 140, 240) },
  leftQuick: {
    backgroundColor: "rgba(255,255,255,0.02)",
    padding: 12,
    borderRadius: 12,
  },
  quickItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  quickLabel: { color: "#e8e8ea", fontWeight: "600" },
  right: { width: 320, padding: 12 },
  bottomNavWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 10,
    alignItems: "center",
    zIndex: 40,
  },
  bottomNav: {
    width: "92%",
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 999,
    paddingVertical: 8,
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  bottomBtn: { padding: 8 },
  fab: {
    position: "absolute",
    right: "4%",
    bottom: 36,
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00f0a8",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
});