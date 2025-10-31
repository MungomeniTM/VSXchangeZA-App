// ======================================================
// Composer.js — VSXchangeZA
// Galactic Intelligence Edition 👽
// ======================================================

import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import styles from "../styles/dashboardStyles";
import { createAPI } from "../api";

export default function Composer({ onPosted }) {
  const [text, setText] = useState("");
  const [fileUri, setFileUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // ======================================================
  // Cosmic animation values
  // ======================================================
  const pulse = useSharedValue(0);
  const glow = useSharedValue(0);

  const animatedAttach = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [1, 1.08]);
    const opacity = interpolate(pulse.value, [0, 1], [0.5, 1]);
    return {
      transform: [{ scale }],
      opacity,
      shadowColor: "#0ff",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    };
  });

  const animatedPost = useAnimatedStyle(() => {
    const scale = interpolate(glow.value, [0, 1], [1, 1.05]);
    return { transform: [{ scale }] };
  });

  // ======================================================
  // Media Picker
  // ======================================================
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
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        pulse.value = withTiming(1, { duration: 200 }, () => {
          pulse.value = withTiming(0, { duration: 400 });
        });
      }
    } catch (err) {
      console.warn("media picker error:", err);
      Alert.alert("Error", "Could not open media picker.");
    }
  };

  // ======================================================
  // Submit Post
  // ======================================================
  const submit = async () => {
    if (!text.trim() && !fileUri) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return Alert.alert("Empty Post", "Write something or attach a file.");
    }

    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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

      // Success feedback
      glow.value = withTiming(1, { duration: 300 }, () => {
        glow.value = withTiming(0, { duration: 400 });
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setText("");
      setFileUri(null);
      onPosted?.();
    } catch (err) {
      console.warn("post error:", err);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Error", "Could not create post. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // Render UI
  // ======================================================
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
          placeholder="Broadcast your brilliance to the galaxy…"
          placeholderTextColor="#9aa"
          style={styles.composerInput}
          multiline
        />
      </View>

      {/* Media Preview */}
      {fileUri && (
        <Image
          source={{ uri: fileUri }}
          style={styles.previewMedia}
          resizeMode="cover"
        />
      )}

      {/* Action Row */}
      <View style={styles.composerActions}>
        <Animated.View style={animatedAttach}>
          <TouchableOpacity style={styles.ghostBtn} onPress={pickMedia}>
            <Text style={styles.ghostText}>Attach</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={styles.ghostBtn}
          onPress={() => Alert.alert("Preview", "Coming soon 👽")}
        >
          <Text style={styles.ghostText}>Preview</Text>
        </TouchableOpacity>

        <Animated.View style={animatedPost}>
          <TouchableOpacity
            style={styles.primaryBtnSmall}
            onPress={submit}
            disabled={loading}
          >
            <Text style={styles.primaryBtnText}>
              {loading ? "Transmitting..." : "Post 🚀"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}