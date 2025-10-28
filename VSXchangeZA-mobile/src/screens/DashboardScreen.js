// src/screens/DashboardScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPosts, createAPI } from "../api";
import PostCard from "../components/PostCard";
import Header from "../components/Header";

export default function DashboardScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchPosts();
      setPosts(res.data || []);
    } catch (err) {
      console.warn("Fetch posts failed:", err?.response?.data || err.message);
      Alert.alert("Error", "Unable to load posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sub = navigation.addListener("focus", load);
    load();
    return sub;
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    navigation.replace("Login");
  };

  const onApprove = async (item) => {
    try {
      const api = await createAPI();
      await api.post(`/posts/${item._id || item.id}/approve`);
      Alert.alert("Approved", "You approved the post.");
      load();
    } catch (err) {
      console.warn(err);
      Alert.alert("Error", "Could not approve.");
    }
  };

  const onComment = (item) => {
    Alert.alert("Comment", "Comment UI not implemented yet.");
  };

  const onShare = (item) => {
    Alert.alert("Share", "Share link or share sheet not implemented yet.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0d1117" }}>
      <Header title="VSXchangeZA" onLogout={logout} />
      {loading ? <ActivityIndicator style={{ marginTop: 30 }} /> : (
        <FlatList data={posts} keyExtractor={(p) => p._id || p.id} renderItem={({ item }) => (
          <PostCard item={item} onApprove={onApprove} onComment={onComment} onShare={onShare} />
        )} contentContainerStyle={{ padding: 12 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({});