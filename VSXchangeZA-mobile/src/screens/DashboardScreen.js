// src/screens/DashboardScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchPosts } from "../api";

export default function DashboardScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetchPosts();
      setPosts(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    navigation.replace("Login");
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.user?.first_name || "Unknown"}</Text>
      <Text style={styles.content}>{item.text || item.content}</Text>
      {item.media_url ? <Text style={styles.media}>[Media]</Text> : null}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.header}>
        <Text style={styles.hTitle}>VSXchangeZA</Text>
        <TouchableOpacity onPress={logout}><Text style={{ color: "#1f6feb" }}>Logout</Text></TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator style={{ marginTop: 30 }} /> :
        <FlatList data={posts} keyExtractor={p => p._id || p.id} renderItem={renderItem} contentContainerStyle={{ padding: 12 }} />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderBottomColor: "#eee", borderBottomWidth: 1 },
  hTitle: { fontSize: 20, fontWeight: "700" },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 8, shadowColor: "#000", shadowOpacity: 0.06, marginBottom: 12, borderWidth: 1, borderColor: "#f1f1f1" },
  name: { fontWeight: "700" },
  content: { marginTop: 6, color: "#333" },
  media: { marginTop: 8, color: "#888" }
});