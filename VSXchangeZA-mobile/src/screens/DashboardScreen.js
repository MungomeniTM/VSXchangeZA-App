import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Alert, ActivityIndicator, RefreshControl, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPosts, createAPI } from "../api";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";
import AnalyticsPanel from "../components/AnalyticsPanel";
import CosmicBackground from "../components/CosmicBackground";
import Composer from "../components/Composer";
import styles from "../styles/dashboardStyles";

export default function DashboardScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchPosts();
      setPosts(res.data?.posts || res.data || []);
    } catch (err) {
      console.warn("Fetch posts failed:", err?.response?.data || err.message);
      Alert.alert("Error", "Unable to load posts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const sub = navigation.addListener("focus", load);
    load();
    return sub;
  }, [navigation, load]);

  const onApprove = async (item) => {
    try {
      await createAPI().then(api => api.post(`/posts/${item._id || item.id}/approve`));
      // optimistic update: increment approval locally
      setPosts(prev => prev.map(p => (p._id === item._id ? { ...p, approvals: (p.approvals||0)+1 } : p)));
    } catch (err) {
      console.warn(err);
      Alert.alert("Error", "Could not approve.");
    }
  };

  const onComment = (item) => {
    navigation.navigate("PostComments", { postId: item._id || item.id });
  };

  const onShare = async (item) => {
    try {
      const link = `${createAPI().then(() => "")}`; // keep placeholder; your share route will replace
      Alert.alert("Share", `Post share link (copy/paste): ${link || "coming soon"}`);
    } catch {
      Alert.alert("Share", "Unable to share now.");
    }
  };

  const onLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    navigation.replace("Login");
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CosmicBackground />
      <Header title="VSXchangeZA" onLogout={onLogout} navigation={navigation} />
      <View style={styles.body}>
        <Sidebar style={styles.sidebar} navigation={navigation} onCreatePost={() => { /* focus composer via ref if needed */ }} />
        <View style={styles.feedCol}>
          <Composer onPosted={load} />
          {loading ? (
            <ActivityIndicator style={{ marginTop: 18 }} />
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(p) => p._id || p.id || Math.random().toString(36).slice(2,9)}
              renderItem={({ item }) => (
                <PostCard item={item} onApprove={() => onApprove(item)} onComment={() => onComment(item)} onShare={() => onShare(item)} />
              )}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              contentContainerStyle={styles.feedList}
            />
          )}
        </View>
        <AnalyticsPanel style={styles.rightCol} />
      </View>
    </SafeAreaView>
  );
}