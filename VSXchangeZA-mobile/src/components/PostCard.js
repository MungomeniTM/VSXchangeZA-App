import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../styles/dashboardStyles";

export default function PostCard({ item = {}, onApprove, onComment, onShare }) {
  const author = item.user?.firstName ? `${item.user.firstName} ${item.user.lastName || ""}` : item.user?.name || "Unknown";
  return (
    <View style={styles.postCard}>
      <View style={styles.postMeta}>
        <View style={styles.avatarSmall}><Text style={styles.avatarInitial}>{(author[0]||'U').toUpperCase()}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.mutedSmall}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}</Text>
        </View>
      </View>

      <Text style={styles.postBody}>{item.text || item.body || ""}</Text>

      {item.media && (
        item.mediaType === "video"
          ? <Text style={[styles.mutedSmall, { marginTop: 8 }]}>[video attachment]</Text>
          : <Image source={{ uri: item.media }} style={styles.postImage} resizeMode="cover" />
      )}

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={onApprove}><Text style={styles.actionText}>Approve {item.approvals||0}</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onComment}><Text style={styles.actionText}>Comment { (item.comments||[]).length }</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onShare}><Text style={styles.actionText}>Share</Text></TouchableOpacity>
      </View>
    </View>
  );
}