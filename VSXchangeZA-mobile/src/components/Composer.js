// ==============================
// Composer.js — VSXchangeZA
// Cosmic Alien-Grade Edition 👽
// ==============================

import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import styles from "../styles/dashboardStyles";
import { createAPI } from "../api";

export default function Composer({ onPosted }) {
  const [text, setText] = useState("");
  const [fileUri, setFileUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==============================
  // Media Picker (optimized for Expo)
  // ==============================
  const pickMedia = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!res.canceled && res.assets?.length > 0) {
        setFileUri(res.assets[0].uri);
      }
    } catch (err) {
      console.warn("media picker error:", err);
      Alert.alert("Error", "Could not open media picker.");
    }
  };

  // ==============================
  // Post Submit Handler
  // ==============================
  const submit = async () => {
    if (!text.trim() && !fileUri) {
      return Alert.alert("Empty Post", "Write something or attach a file.");
    }

    try {
      setLoading(true);
      const api = await createAPI();

      const form = new FormData();
      form.append("text", text);

      if (fileUri) {
        const filename = fileUri.split("/").pop();
        form.append("media", {
          uri: fileUri,
          name: filename,
          type: "image/jpeg",
        });
      }

      await api.post("/posts", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset after success
      setText("");
      setFileUri(null);
      onPosted?.();
    } catch (err) {
      console.warn("post error:", err);
      Alert.alert("Error", "Could not create post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // Render Composer UI
  // ==============================
  return (
    <View style={styles.composerCard}>
      {/* Input Row */}
      <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarInitial}>U</Text>
        </View>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Share your work, project, or insight…"
          placeholderTextColor="#9aa"
          style={styles.composerInput}
          multiline
        />
      </View>

      {/* Preview */}
      {fileUri && (
        <Image
          source={{ uri: fileUri }}
          style={styles.previewMedia}
          resizeMode="cover"
        />
      )}

      {/* Actions */}
      <View style={styles.composerActions}>
        <TouchableOpacity style={styles.ghostBtn} onPress={pickMedia}>
          <Text style={styles.ghostText}>Attach</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={styles.ghostBtn}
          onPress={() => Alert.alert("Preview", "Coming soon 👽")}
        >
          <Text style={styles.ghostText}>Preview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryBtnSmall}
          onPress={submit}
          disabled={loading}
        >
          <Text style={styles.primaryBtnText}>
            {loading ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}