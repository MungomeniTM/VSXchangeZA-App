// src/components/PostCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function PostCard({ item, onApprove, onComment, onShare }) {
  return (
    <View style={styles.card}>
      <View style={{flexDirection:"row", justifyContent:"space-between"}}>
        <Text style={styles.user}>{item.user?.first_name || item.user?.username || "Unknown"}</Text>
        <Text style={styles.time}>{new Date(item.createdAt || item.created_at || Date.now()).toLocaleString()}</Text>
      </View>

      <Text style={styles.content}>{item.content || item.text || ""}</Text>
      {item.mediaUrl || item.media_url ? <Text style={styles.media}>[Media]</Text> : null}

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onApprove(item)} style={styles.actionBtn}><Text>🤝 Approve</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => onComment(item)} style={styles.actionBtn}><Text>💬 Comment</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => onShare(item)} style={styles.actionBtn}><Text>🔁 Share</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#0f1720", padding: 12, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: "#1b2430" },
  user: { color: "#fff", fontWeight: "700" },
  time: { color: "#9aa", fontSize: 11 },
  content: { color: "#ddd", marginTop: 8 },
  media: { color: "#8b98a8", marginTop: 8 },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  actionBtn: { padding: 8, borderRadius: 8, backgroundColor: "#071221", borderWidth: 1, borderColor: "#122135" }
});