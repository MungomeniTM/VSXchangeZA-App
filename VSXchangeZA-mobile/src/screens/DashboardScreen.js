// src/screens/DashboardScreen.js
// ==============================
// VSXchangeZA — DashboardScreen
// Cosmic / Alien-grade, Reanimated-powered, no Skia
// Paste into src/screens/DashboardScreen.js
// ==============================

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
  Easing,
} from "react-native-reanimated";

import Header from "../components/Header"; // existing header (title + menu)
import Composer from "../components/Composer"; // existing composer (create post)
import PostCard from "../components/PostCard"; // existing post card
import AnalyticsPanel from "../components/AnalyticsPanel"; // existing analytics (optional)
import Sidebar from "../components/Sidebar"; // optional; used for left panel
import { fetchPosts, approvePost } from "../api"; // keep your api.js as-is

// --------------------
// Utilities
// --------------------
function uniqueById(items = []) {
  const map = new Map();
  for (const p of items) {
    const id = p._id || p.id || (p._tempId || Math.random().toString(36).slice(2, 9));
    if (!map.has(id)) map.set(id, { ...p, _tempId: id });
  }
  return Array.from(map.values());
}

// simple responsive clamp
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// --------------------
// Skill set (default)
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

  // state
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  // sidebar animation
  const sidebarOpen = useSharedValue(isNarrow ? 0 : 1);
  const sidebarAnim = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(sidebarOpen.value ? 0 : -300, { duration: 360, easing: Easing.out(Easing.cubic) }) }],
    opacity: withTiming(sidebarOpen.value ? 1 : 0.9, { duration: 260 }),
  }));

  // explore modal (top VSXplore)
  const [exploreOpen, setExploreOpen] = useState(false);
  const [skillQuery, setSkillQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(new Set());

  // fab state
  const [fabOpen, setFabOpen] = useState(false);

  // load posts (dedupe + stable keys)
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPosts();
      const items = res?.data?.posts || res?.data || [];
      const uniq = uniqueById(items);
      if (!mounted.current) return;
      setPosts(uniq);
    } catch (err) {
      console.warn("Fetch posts failed:", err?.response?.data || err?.message || err);
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

  // toggle sidebar
  const toggleSidebar = () => { sidebarOpen.value = sidebarOpen.value ? 0 : 1; };

  // approve handler (optimistic)
  const onApprove = async (item) => {
    try {
      setPosts(prev => prev.map(p => (p._id === item._id ? { ...p, approvals: (p.approvals || 0) + 1 } : p)));
      // call api (approvePost exported from api.js)
      if (approvePost) await approvePost(item._id || item.id);
    } catch (err) {
      console.warn("approve error:", err);
      Alert.alert("Error", "Could not approve.");
      // rollback: reload
      load();
    }
  };

  // filter posts by active skill filters & search
  const filteredPosts = posts.filter(p => {
    if (!activeFilters.size) return true;
    const userSkills = (p.user?.skills || p.skills || []).map(s => String(s || "").toLowerCase());
    for (const f of activeFilters) {
      if (userSkills.includes(String(f).toLowerCase()) || (p.tags || []).map(t => String(t).toLowerCase()).includes(String(f).toLowerCase())) {
        return true;
      }
    }
    return false;
  });

  // search skills for explore panel
  const skillHits = SKILLS.filter(s => s.toLowerCase().includes(skillQuery.trim().toLowerCase()));

  // bottom nav
  const BottomNav = () => (
    <View style={styles.bottomNavWrap}>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation?.navigate?.("Dashboard")}>
          <Text style={styles.bottomIcon}>🏠</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBtn} onPress={() => setExploreOpen(true)}>
          <Text style={styles.bottomIcon}>🔍</Text>
        </TouchableOpacity>

        <View style={{ width: 56 }} />

        <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation?.navigate?.("Messages")}>
          <Text style={styles.bottomIcon}>💬</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.bottomBtn} onPress={() => navigation?.navigate?.("Profile")}>
          <Text style={styles.bottomIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* FAB */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => { setFabOpen(v => !v); navigation?.navigate?.("CreatePost"); }}
        style={styles.fab}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );

  // render post list item wrapper to pass handlers
  const renderItem = ({ item }) => (
    <PostCard
      item={item}
      onApprove={() => onApprove(item)}
      onComment={() => navigation?.navigate?.("PostComments", { postId: item._id || item.id })}
      onShare={() => Alert.alert("Share", `Share link: ${item._id || item.id || "—"}`)}
    />
  );

  // Quick left links (Analytics, Farms, Collaborate, Equipment)
  const LeftQuickList = () => (
    <View accessible style={styles.leftQuick}>
      <TouchableOpacity style={styles.quickItem} onPress={() => navigation?.navigate?.("Analytics")}>
        <Text style={styles.quickLabel}>Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickItem} onPress={() => navigation?.navigate?.("Farms")}>
        <Text style={styles.quickLabel}>Farms</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickItem} onPress={() => navigation?.navigate?.("Collaborate")}>
        <Text style={styles.quickLabel}>Collaborate</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.quickItem} onPress={() => navigation?.navigate?.("Equipment")}>
        <Text style={styles.quickLabel}>Equipment</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header
        title="VSXplore"
        onMenuToggle={toggleSidebar}
        navigation={navigation}
        // header also acts as "open explore" when pressed on title
        onTitlePress={() => setExploreOpen(true)}
      />

      <View style={styles.body}>
        {/* Animated Sidebar (left) */}
        <Animated.View style={[styles.sidebar, sidebarAnim]}>
          <Sidebar navigation={navigation} onCreatePost={() => navigation?.navigate?.("CreatePost")} />
        </Animated.View>

        {/* Main Column */}
        <View style={styles.main}>
          {/* Composer at top */}
          <Composer onPosted={load} />

          {/* Feed or loader */}
          {loading ? (
            <ActivityIndicator style={{ marginTop: 30 }} size="large" color="#00f0a8" />
          ) : (
            <FlatList
              data={filteredPosts}
              renderItem={renderItem}
              keyExtractor={(p) => p._id || p.id || p._tempId}
              contentContainerStyle={styles.feedContainer}
              ListHeaderComponent={() => (
                <>
                  {/* compact analytics preview */}
                  <View style={styles.analyticsWrapper}>
                    <AnalyticsPanel />
                  </View>

                  {/* small skill-filter chips */}
                  <View style={styles.chipsRow}>
                    {SKILLS.slice(0, 6).map(s => {
                      const active = activeFilters.has(s);
                      return (
                        <TouchableOpacity
                          key={s}
                          onPress={() => {
                            setActiveFilters(prev => {
                              const next = new Set(prev);
                              if (next.has(s)) next.delete(s); else next.add(s);
                              return next;
                            });
                          }}
                          style={[styles.chip, active && styles.chipActive]}
                          accessibilityRole="button"
                        >
                          <Text style={[styles.chipText, active && styles.chipTextActive]}>{s}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}
            />
          )}
        </View>

        {/* Right column (only on wide screens) */}
        {!isNarrow ? (
          <View style={styles.right}>
            <LeftQuickList />
            <View style={{ height: 12 }} />
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

      {/* Bottom navigation + FAB */}
      <BottomNav />

      {/* Explore modal (top VSXplore panel) */}
      <Modal visible={exploreOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setExploreOpen(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setExploreOpen(false)}>
              <Text style={styles.modalClose}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Find Skills</Text>
            <View style={{ width: 58 }} />
          </View>

          <View style={styles.searchRow}>
            <TextInput
              value={skillQuery}
              onChangeText={setSkillQuery}
              placeholder="Search skills (carpenter, electrician, farming...)"
              placeholderTextColor="#9aa3ad"
              style={styles.searchInput}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.skillList}>
            {skillHits.length === 0 ? (
              <Text style={styles.mutedSmall}>No results — try typing “farm” or “carpenter”</Text>
            ) : skillHits.map(s => {
              const active = activeFilters.has(s);
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.skillItem, active && styles.skillItemActive]}
                  onPress={() => {
                    setActiveFilters(prev => {
                      const next = new Set(prev);
                      if (next.has(s)) next.delete(s); else next.add(s);
                      return next;
                    });
                  }}
                >
                  <Text style={[styles.skillLabel, active && styles.skillLabelActive]}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.modalAction} onPress={() => { setActiveFilters(new Set()); setSkillQuery(""); }}>
              <Text style={styles.modalActionText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.modalAction, styles.modalActionPrimary]} onPress={() => { setExploreOpen(false); }}>
              <Text style={[styles.modalActionText, styles.modalActionTextPrimary]}>Apply</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

// --------------------
// Styles — Alien-grade polish (responsive)
// --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#071018" },
  body: { flex: 1, flexDirection: "row", gap: 12 },

  // sidebar (left)
  sidebar: { width: 280, zIndex: 20, padding: 8 },

  // main feed
  main: { flex: 1, paddingHorizontal: 12 },
  feedContainer: { paddingBottom: clamp(140, 140, 240) },

  analyticsWrapper: { marginBottom: 12 },

  chipsRow: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 12 },

  chip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.02)", marginRight: 8 },
  chipActive: { backgroundColor: "#00f0a8", shadowColor: "#00f0a8", shadowOpacity: 0.12, shadowRadius: 8 },
  chipText: { color: "#cfeee6", fontWeight: "700" },
  chipTextActive: { color: "#061015" },

  // right column
  right: { width: 320, padding: 12 },
  leftQuick: { backgroundColor: "rgba(255,255,255,0.01)", padding: 12, borderRadius: 12 },
  quickItem: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.02)" },
  quickLabel: { color: "#e8e8ea", fontWeight: "700" },

  rightCard: { marginTop: 12, padding: 12, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.01)" },
  rightTitle: { color: "#e8e8ea", fontWeight: "800", marginBottom: 6 },
  mutedSmall: { color: "#9aa3ad", fontSize: 12 },

  useGeo: { marginTop: 10, paddingVertical: 10, backgroundColor: "transparent", borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  useGeoText: { color: "#cfeee6", textAlign: "center" },

  // bottom nav
  bottomNavWrap: { position: "absolute", left: 0, right: 0, bottom: 10, alignItems: "center", zIndex: 40 },
  bottomNav: { width: "92%", maxWidth: 960, flexDirection: "row", backgroundColor: "rgba(0,0,0,0.45)", borderRadius: 999, paddingVertical: 8, justifyContent: "space-around", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  bottomBtn: { padding: 8, alignItems: "center", justifyContent: "center" },
  bottomIcon: { fontSize: 20, color: "#e8e8ea" },

  fab: {
    position: "absolute",
    right: "4%",
    bottom: 36,
    width: 62,
    height: 62,
    borderRadius: 999,
    backgroundColor: "#00f0a8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00f0a8",
    shadowOpacity: 0.28,
    shadowRadius: 18,
  },
  fabText: { color: "#061015", fontSize: 30, fontWeight: "900" },

  // modal / explore
  modalSafe: { flex: 1, backgroundColor: "#071018", padding: 12 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 8 },
  modalClose: { color: "#9aa3ad" },
  modalTitle: { color: "#e8e8ea", fontWeight: "800", fontSize: 18 },
  searchRow: { marginTop: 8 },
  searchInput: { backgroundColor: "rgba(255,255,255,0.02)", padding: Platform.OS === "ios" ? 14 : 10, borderRadius: 12, color: "#e8e8ea" },
  skillList: { marginTop: 12 },
  skillItem: { padding: 12, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.01)", marginBottom: 8 },
  skillItemActive: { backgroundColor: "rgba(0,240,168,0.14)" },
  skillLabel: { color: "#e8e8ea", fontWeight: "700" },
  skillLabelActive: { color: "#00f0a8" },

  modalFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: "auto", paddingVertical: 12 },
  modalAction: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  modalActionPrimary: { backgroundColor: "#00f0a8", borderColor: "transparent" },
  modalActionText: { color: "#e8e8ea", fontWeight: "800" },
  modalActionTextPrimary: { color: "#061015" },
});