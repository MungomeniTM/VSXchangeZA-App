// src/screens/DashboardScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Image,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import AnalyticsPanel from "../components/AnalyticsPanel";
import FloatingActionButton from "../components/FloatingActionButton";
import styles, { COLORS } from "../styles/dashboardStyles";
import { fetchPosts, initSocket, getProfile, approvePost, setBaseURL } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSocket } from "../api";

// If running on device, setBaseURL("http://<YOUR_IP>:5000/api")
if (Platform.OS !== "web") {
  // optionally auto-detect — keep default for now
}

export default function DashboardScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedPage, setFeedPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [composerText, setComposerText] = useState("");
  const [composerFile, setComposerFile] = useState(null);
  const socketRef = useRef(null);

  async function loadInitial() {
    setLoading(true);
    try {
      // profile
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          navigation.replace("Login");
          return;
        }
      } catch {}
      const prof = await getProfile();
      setUser(prof.data || null);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
    await loadFeed(true);
    // init socket
    try {
      socketRef.current = initSocket(); // server base deduced in api.js
      socketRef.current.on("refreshFeed", () => loadFeed(true));
    } catch {}
  }

  async function loadFeed(reset = false) {
    if (!hasMore && !reset) return;
    try {
      const page = reset ? 1 : feedPage;
      const res = await fetchPosts(page, 12);
      const items = res?.data?.posts || res?.data || [];
      if (reset) {
        setPosts(items);
        setFeedPage(2);
        setHasMore(items.length === 12);
      } else {
        setPosts((p) => [...p, ...items]);
        setFeedPage((n) => n + 1);
        setHasMore(items.length === 12);
      }
    } catch (err) {
      console.warn("loadFeed err", err.message || err);
    }
  }

  useEffect(() => {
    loadInitial();
    return () => {
      const s = getSocket();
      try { s?.off?.("refreshFeed"); } catch {}
    };
  }, []);

  const openImagePicker = async () => {
    const p = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!p.granted) return Alert.alert("Permission required", "Please allow media access.");
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.cancelled) setComposerFile(result.uri);
  };

  const submitPost = async () => {
    if (!composerText && !composerFile) return Alert.alert("Write or attach a file");
    // build form data and post via axios instance (not implemented here to avoid extra deps)
    Alert.alert("Posting", "This will upload to your /posts endpoint (implement FormData upload)");
    // After successful post, refresh feed and clear
    setComposerText("");
    setComposerFile(null);
    await loadFeed(true);
    const s = getSocket();
    s?.emit?.("newPost");
  };

  const handleApprove = async (item) => {
    try {
      await approvePost(item._id || item.id);
      // optimistic update
      setPosts((prev) => prev.map((p) => (p._id === item._id ? { ...p, approvals: (p.approvals || 0) + 1 } : p)));
    } catch (err) {
      Alert.alert("Error", "Could not approve.");
    }
  };

  const onShare = async (item) => {
    try {
      if (Platform.OS === "web") {
        await navigator.clipboard.writeText(window.location.origin + "/posts/" + (item._id || item.id));
        Alert.alert("Link copied");
      } else {
        Alert.alert("Share", "Share sheet integration can be added (Share API).");
      }
    } catch {
      Alert.alert("Share failed");
    }
  };

  const renderItem = ({ item }) => (
    <PostCard item={item} onApprove={handleApprove} onComment={() => Alert.alert("Comments", "Open comments UI")} onShare={onShare} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header onOpenSidebar={() => navigation.toggleDrawer?.()} onSearch={(q) => console.log("search", q)} />
      <View style={styles.containerPadding}>
        {/* Analytics */}
        <AnalyticsPanel />

        {/* Composer */}
        <View style={styles.composerCard}>
          <TextInput
            style={styles.composeText}
            placeholder="Share your work, project, or insight…"
            placeholderTextColor={COLORS.muted}
            value={composerText}
            onChangeText={setComposerText}
            multiline
          />
          {composerFile ? <Image source={{ uri: composerFile }} style={{ width: "100%", height: 160, borderRadius: 10, marginTop: 8 }} /> : null}
          <View style={{ marginTop: 8, flexDirection: "row", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity onPress={openImagePicker} style={{ padding: 8 }}>
                <Text style={{ color: COLORS.muted }}>Attach</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity onPress={() => { setComposerText(""); setComposerFile(null); }}><Text style={{ color: COLORS.muted }}>Clear</Text></TouchableOpacity>
              <TouchableOpacity onPress={submitPost} style={{ backgroundColor: COLORS.blue, padding: 10, borderRadius: 10 }}>
                <Text style={{ color: "#061015", fontWeight: "800" }}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Feed */}
        {loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : (
          <FlatList
            data={posts}
            renderItem={renderItem}
            keyExtractor={(i) => i._id || i.id}
            style={styles.feedList}
            onEndReached={() => loadFeed(false)}
            onEndReachedThreshold={0.6}
            ListEmptyComponent={<Text style={{ color: COLORS.muted, marginTop: 20 }}>No posts yet.</Text>}
          />
        )}
      </View>

      {/* Sidebar (small screen: a modal / screen – here we inline a compact sidebar button) */}
      <FloatingActionButton onPress={() => navigation.navigate("CreatePost")} />
    </SafeAreaView>
  );
}