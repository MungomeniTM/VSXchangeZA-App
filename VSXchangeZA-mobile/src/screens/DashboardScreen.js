// src/screens/DashboardScreen.js
// ==========================================================
// VSXchangeZA — DashboardScreen
// Cosmic / Alien-grade, Vector-Icons integrated, no Skia
// Slide-up VSXplore modal (TikTok-style), responsive + robust
// ==========================================================

import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
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
  Pressable,
} from "react-native";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

import Header from "../components/Header";
import Composer from "../components/Composer";
import PostCard from "../components/PostCard";
import AnalyticsPanel from "../components/AnalyticsPanel";
import Sidebar from "../components/Sidebar";
import { fetchPosts, approvePost } from "../api";

// -------------------- Utilities --------------------
function uniqueById(items = []) {
  const map = new Map();
  for (const p of items) {
    const id = p._id || p.id || p._tempId || Math.random().toString(36).slice(2, 9);
    if (!map.has(id)) map.set(id, { ...p, _tempId: id });
  }
  return Array.from(map.values());
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// -------------------- Skill set --------------------
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

// -------------------- DashboardScreen --------------------
export default function DashboardScreen({ navigation }) {
  // responsive
  const { width, height } = useWindowDimensions();
  const isNarrow = width < 760;

  // dynamic sheet height (hook used inside component)
  const sheetHeight = Math.min(680, Math.round(height * 0.78));

  // data + lifecycle
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  // left sidebar animation
  const sidebarOpen = useSharedValue(isNarrow ? 0 : 1);
  const sidebarAnim = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(sidebarOpen.value ? 0 : -300, {
          duration: 340,
          easing: Easing.out(Easing.cubic),
        }),
      },
    ],
    opacity: withTiming(sidebarOpen.value ? 1 : 0.92, { duration: 260 }),
  }));

  // VSXplore sheet (slide-up)
  const [exploreOpen, setExploreOpen] = useState(false);
  const sheetY = useSharedValue(sheetHeight); // starts off-screen
  useEffect(() => {
    // whenever sheetHeight changes (orientation), keep sheetY consistent
    if (!exploreOpen) sheetY.value = sheetHeight;
  }, [sheetHeight]);

  useEffect(() => {
    if (exploreOpen) {
      sheetY.value = withTiming(0, { duration: 420, easing: Easing.out(Easing.cubic) });
    } else {
      sheetY.value = withTiming(sheetHeight, { duration: 320, easing: Easing.in(Easing.cubic) });
    }
  }, [exploreOpen, sheetHeight]);

  const sheetAnim = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value }],
    shadowOpacity: exploreOpen ? 0.18 : 0,
  }));

  // top orb pulse
  const orbPulse = useSharedValue(1);
  useEffect(() => {
    let mountedFlag = true;
    const loop = () => {
      orbPulse.value = withTiming(1.06, { duration: 1100, easing: Easing.inOut(Easing.ease) }, () => {
        if (!mountedFlag) return;
        orbPulse.value = withTiming(1.02, { duration: 1200, easing: Easing.inOut(Easing.ease) }, () => {
          if (!mountedFlag) return;
          loop();
        });
      });
    };
    loop();
    return () => { mountedFlag = false; };
  }, []);

  const orbStyle = useAnimatedStyle(() => ({ transform: [{ scale: orbPulse.value }], shadowRadius: 12 }));

  // composer FAB rotation
  const rotation = useSharedValue(0);
  const fabStyle = useAnimatedStyle(() => ({ transform: [{ rotateZ: `${rotation.value}deg` }, { scale: 1 }] }));

  // sheet / search state
  const [skillQuery, setSkillQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(new Set());

  // load posts (safe)
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
    return () => { mounted.current = false; sub?.(); };
  }, [navigation, load]);

  // open/close helpers
  const openExplore = (flag) => {
    setExploreOpen(flag);
  };
  const toggleSidebar = () => { sidebarOpen.value = sidebarOpen.value ? 0 : 1; };

  // approve (optimistic)
  const onApprove = async (item) => {
    try {
      setPosts(prev => prev.map(p => p._id === item._id ? { ...p, approvals: (p.approvals || 0) + 1 } : p));
      if (approvePost) await approvePost(item._id || item.id);
    } catch (err) {
      console.warn("approve error:", err);
      Alert.alert("Error", "Could not approve.");
      load();
    }
  };

  // filter logic: supports activeFilters + skillQuery
  const filteredPosts = useMemo(() => {
    if ((!activeFilters || activeFilters.size === 0) && !skillQuery.trim()) return posts;
    const q = skillQuery.trim().toLowerCase();
    return posts.filter(p => {
      const text = (p.text || p.body || p.title || "").toLowerCase();
      const userSkills = (p.user?.skills || p.skills || []).map(s => String(s || "").toLowerCase());
      const tags = (p.tags || []).map(t => String(t || "").toLowerCase());
      const matchesQuery = q ? (text.includes(q) || userSkills.some(s => s.includes(q)) || tags.some(t => t.includes(q))) : true;
      if (!activeFilters || activeFilters.size === 0) return matchesQuery;
      const matchesFilter = Array.from(activeFilters).some(f => {
        const ff = String(f).toLowerCase();
        return userSkills.includes(ff) || tags.includes(ff) || (p.title || "").toLowerCase().includes(ff);
      });
      return matchesQuery && matchesFilter;
    });
  }, [posts, activeFilters, skillQuery]);

  const skillHits = useMemo(() => SKILLS.filter(s => s.toLowerCase().includes(skillQuery.trim().toLowerCase())), [skillQuery]);

  // when chip tapped: immediately apply filter and close sheet (per your request)
  const onSkillTap = (skill) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      if (next.has(skill)) next.delete(skill); else next.add(skill);
      return next;
    });
    // close sheet and keep filter applied
    openExplore(false);
  };

  // render item (stable)
  const renderItem = useCallback(({ item }) => (
    <PostCard
      item={item}
      onApprove={() => onApprove(item)}
      onComment={() => navigation?.navigate?.("PostComments", { postId: item._id || item.id })}
      onShare={() => Alert.alert("Share", `Share link: ${item._id || item.id || "—"}`)}
    />
  ), [navigation]);

  const keyExtractor = useCallback(p => p._id || p.id || p._tempId, []);

  // quick access list component
  const LeftQuickList = () => (
    <View accessible style={styles.leftQuick}>
      <TouchableOpacity style={styles.quickItem} onPress={() => navigation?.navigate?.("Analytics")}>
        <Icon name="analytics-outline" size={18} color="#00f0a8" />
        <Text style={styles.quickLabel}> Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickItem} onPress={() => navigation?.navigate?.("Farms")}>
        <Icon name="leaf-outline" size={18} color="#00f0a8" />
        <Text style={styles.quickLabel}> Farms</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickItem} onPress={() => navigation?.navigate?.("Collaborate")}>
        <Icon name="people-outline" size={18} color="#00f0a8" />
        <Text style={styles.quickLabel}> Collaborate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickItem} onPress={() => navigation?.navigate?.("Equipment")}>
        <Icon name="construct-outline" size={18} color="#00f0a8" />
        <Text style={styles.quickLabel}> Equipment</Text>
      </TouchableOpacity>
    </View>
  );

  // Bottom Nav + orb + FAB
  const BottomNav = () => (
    <View style={styles.bottomNavWrap} pointerEvents="box-none">
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation?.navigate?.("Dashboard")}>
          <Icon name="home-outline" size={24} color="#e8e8ea" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBtn} onPress={() => openExplore(true)}>
          <Icon name="search-outline" size={24} color="#e8e8ea" />
        </TouchableOpacity>

        <View style={{ width: 56 }} />

        <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation?.navigate?.("Messages")}>
          <Icon name="chatbubble-ellipses-outline" size={24} color="#e8e8ea" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation?.navigate?.("Profile")}>
          <Icon name="person-outline" size={24} color="#e8e8ea" />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.fabWrap, fabStyle]}>
        <TouchableOpacity activeOpacity={0.95} onPress={() => {
          rotation.value = rotation.value + 45;
          navigation?.navigate?.("CreatePost");
        }}>
          <LinearGradient colors={["#00f0a8", "#1e90ff"]} style={styles.fabGradient}>
            <Icon name="add" size={28} color="#061015" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Top-center VSXplore orb */}
      <Animated.View style={[styles.topOrbWrap, orbStyle]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => openExplore(true)}
          style={({ pressed }) => [styles.topOrb, pressed && { transform: [{ scale: 0.96 }] }]}
        >
          <LinearGradient colors={["#00f0a8", "#1e90ff"]} style={styles.topOrbInner}>
            <Icon name="search" size={18} color="#061015" />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );

  // -------------------- Render --------------------
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* animated cosmic background (kept minimal for performance) */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.bgLayer]} pointerEvents="none" />

      {/* Header */}
      <Header title="VSXplore" onMenuToggle={toggleSidebar} navigation={navigation} onTitlePress={() => openExplore(true)} />

      <View style={styles.body}>
        {/* left sidebar */}
        <Animated.View style={[styles.sidebar, sidebarAnim]}>
          <Sidebar navigation={navigation} onCreatePost={() => navigation?.navigate?.("CreatePost")} />
        </Animated.View>

        {/* main feed */}
        <View style={styles.main}>
          <Composer onPosted={load} />
          {loading ? (
            <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#00f0a8" />
          ) : (
            <FlatList
              data={filteredPosts}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.feedContainer}
              removeClippedSubviews={true}
              initialNumToRender={6}
              windowSize={7}
            />
          )}
        </View>

        {/* right column */}
        {!isNarrow ? (
          <View style={styles.right}>
            <LeftQuickList />
            <View style={styles.rightCard}>
              <Text style={styles.rightTitle}>Nearby Projects</Text>
              <Text style={styles.mutedSmall}>Enable location to see projects near you.</Text>
              <TouchableOpacity style={styles.useGeo} onPress={() => Alert.alert("Geolocation", "Coming soon")}>
                <Text style={styles.useGeoText}>Use my location</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>

      {/* Bottom nav + orb + FAB */}
      <BottomNav />

      {/* VSXplore slide-up modal (custom animated sheet) */}
      <Modal visible={exploreOpen} transparent animationType="none" onRequestClose={() => openExplore(false)}>
        <View style={styles.sheetOverlay}>
          {/* tap overlay to close */}
          <TouchableOpacity style={styles.overlayTouchable} activeOpacity={1} onPress={() => openExplore(false)} />

          {/* Animated sheet */}
          <Animated.View style={[styles.sheet, sheetAnim, { height: sheetHeight }]}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Find skills & people</Text>
              <TouchableOpacity onPress={() => openExplore(false)}>
                <Icon name="close" size={22} color="#cfeee6" />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetSearchRow}>
              <Icon name="search" size={18} color="#9aa3ad" />
              <TextInput
                value={skillQuery}
                onChangeText={setSkillQuery}
                placeholder="Search skills (carpenter, electrician, farming...)"
                placeholderTextColor="#9aa3ad"
                style={styles.sheetSearchInput}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setSkillQuery("")}>
                <Icon name="close-circle" size={20} color="#9aa3ad" />
              </TouchableOpacity>
            </View>

            <View style={styles.sheetChips}>
              {(skillHits.length ? skillHits : SKILLS).map((s) => {
                const active = activeFilters.has(s);
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => onSkillTap(s)}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{s}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.sheetFooter}>
              <TouchableOpacity style={styles.sheetBtn} onPress={() => { setSkillQuery(""); setActiveFilters(new Set()); }}>
                <Text style={styles.sheetBtnText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.sheetBtn, styles.sheetBtnPrimary]} onPress={() => openExplore(false)}>
                <Text style={[styles.sheetBtnText, styles.sheetBtnPrimaryText]}>Apply</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// -------------------- Styles (Intergalactic polish) --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#061015" },
  bgLayer: {
    // keep subtle layer for z-order & potential gradient overlays
    backgroundColor: "transparent",
  },

  body: { flex: 1, flexDirection: "row" },

  // sidebar
  sidebar: { width: 280, zIndex: 20, padding: 8 },

  // main feed area
  main: { flex: 1, paddingHorizontal: 12 },
  feedContainer: { paddingBottom: clamp(140, 140, 260) },

  // right column
  right: { width: 320, padding: 12 },
  leftQuick: { backgroundColor: "rgba(255,255,255,0.02)", padding: 12, borderRadius: 12 },
  quickItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  quickLabel: { color: "#e8e8ea", fontWeight: "600" },
  rightCard: { marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.01)" },
  rightTitle: { color: "#e8e8ea", fontWeight: "800", marginBottom: 6 },
  mutedSmall: { color: "#9aa3ad", fontSize: 12 },
  useGeo: { marginTop: 10, paddingVertical: 10, backgroundColor: "transparent", borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  useGeoText: { color: "#cfeee6", textAlign: "center" },

  // bottom nav + orb + FAB container
  bottomNavWrap: { position: "absolute", left: 0, right: 0, bottom: 10, alignItems: "center", zIndex: 60 },
  bottomNav: {
    width: "92%", maxWidth: 980,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 999,
    paddingVertical: 8,
    justifyContent: "space-around",
    alignItems: "center",
    borderWidth: 1, borderColor: "rgba(255,255,255,0.04)",
  },
  bottomBtn: { padding: 8 },

  // top orb
  topOrbWrap: {
    position: "absolute",
    top: Platform.OS === "ios" ? 10 : 6,
    left: "50%",
    transform: [{ translateX: -28 }],
    zIndex: 80,
  },
  topOrb: {
    width: 56, height: 56, borderRadius: 999, alignItems: "center", justifyContent: "center",
    shadowColor: "#00f0a8", shadowOpacity: 0.18, shadowRadius: 12, elevation: 8,
  },
  topOrbInner: { width: 52, height: 52, borderRadius: 999, alignItems: "center", justifyContent: "center" },

  // fab
  fabWrap: { position: "absolute", right: "5%", bottom: 44, zIndex: 80 },
  fabGradient: { width: 64, height: 64, borderRadius: 999, alignItems: "center", justifyContent: "center", elevation: 10, shadowColor: "#00f0a8", shadowOpacity: 0.3, shadowRadius: 14 },

  // sheet (modal) - height applied inline per device
  sheetOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.28)" },
  overlayTouchable: { ...StyleSheet.absoluteFillObject },
  sheet: {
    // height set dynamically inline to avoid hooks inside StyleSheet
    backgroundColor: "#071018",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    paddingBottom: 28,
    shadowColor: "#000",
  },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sheetTitle: { color: "#e8e8ea", fontWeight: "800", fontSize: 16 },
  sheetSearchRow: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.02)", padding: 10, borderRadius: 12, gap: 10 },
  sheetSearchInput: { flex: 1, paddingHorizontal: 8, color: "#e8e8ea", minHeight: 36 },

  sheetChips: { marginTop: 12, flexDirection: "row", flexWrap: "wrap", gap: 8 },

  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.02)", marginRight: 8, marginBottom: 8 },
  chipActive: { backgroundColor: "#00f0a8" },
  chipText: { color: "#cfeee6", fontWeight: "700" },
  chipTextActive: { color: "#061015" },

  sheetFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
  sheetBtn: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  sheetBtnPrimary: { backgroundColor: "#00f0a8", borderColor: "transparent" },
  sheetBtnText: { color: "#e8e8ea", fontWeight: "700" },
  sheetBtnPrimaryText: { color: "#061015" },

  // quick components
  leftQuick: { },
  rightCard: { marginTop: 12, padding: 12, borderRadius: 12 },
});