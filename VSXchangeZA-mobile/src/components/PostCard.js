// src/components/PostCard.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import styles, { COLORS } from "../styles/dashboardStyles";
import { AntDesign, Feather } from "@expo/vector-icons";

export default function PostCard({ item, onApprove, onComment, onShare }) {
  const author = item.user?.firstName ? `${item.user.firstName} ${item.user.lastName || ""}` : item.user?.name || "Unknown";
  return (
    <View style={[styles.glass, { marginBottom: 12 }]}>
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: "linear-gradient(90deg,#1e90ff,#00f0a8)", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#061015", fontWeight: "800" }}>{(author || "U").charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: COLORS.text, fontWeight: "700" }}>{author}</Text>
          <Text style={styles.smallMuted}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={{ color: COLORS.text }}>{item.text}</Text>
        {item.media && (
          <Image source={{ uri: item.media }} style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 10 }} resizeMode="cover" />
        )}
      </View>

      <View style={{ marginTop: 12, flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => onApprove?.(item)} style={cardAction}>
          <AntDesign name="hearto" size={18} color={COLORS.text} />
          <Text style={actionText}>{item.approvals || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onComment?.(item)} style={cardAction}>
          <Feather name="message-circle" size={18} color={COLORS.text} />
          <Text style={actionText}>{(item.comments || []).length}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onShare?.(item)} style={cardAction}>
          <Feather name="share-2" size={18} color={COLORS.text} />
          <Text style={actionText}>{item.shares || 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const cardAction = { flexDirection: "row", gap: 8, alignItems: "center" };
const actionText = { color: COLORS.muted, marginLeft: 6 };