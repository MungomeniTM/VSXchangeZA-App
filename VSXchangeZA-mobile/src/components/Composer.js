import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import styles from "../styles/dashboardStyles";
import { createAPI } from "../api";

export default function Composer({ onPosted }) {
  const [text, setText] = useState("");
  const [fileUri, setFileUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickMedia = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, quality: 0.7 });
    if (!res.cancelled) setFileUri(res.uri);
  };

  const submit = async () => {
    if (!text.trim() && !fileUri) return alert("Write something or attach a file.");
    try {
      setLoading(true);
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
      const api = await createAPI();
      await api.post("/posts", form, { headers: { "Content-Type": "multipart/form-data" } });
      setText(""); setFileUri(null);
      onPosted?.();
    } catch (err) {
      console.warn("post error", err);
      alert("Could not create post.");
    } finally { setLoading(false); }
  };

  return (
    <View style={styles.composerCard}>
      <View style={{flexDirection:'row', gap:10, alignItems:'center'}}>
        <View style={styles.avatarSmall}><Text style={styles.avatarInitial}>U</Text></View>
        <TextInput value={text} onChangeText={setText} placeholder="Share your work, project, or insight…" placeholderTextColor="#9aa" style={styles.composerInput} multiline />
      </View>

      {fileUri && <Image source={{ uri: fileUri }} style={styles.previewMedia} />}

      <View style={styles.composerActions}>
        <TouchableOpacity style={styles.ghostBtn} onPress={pickMedia}><Text style={styles.ghostText}>Attach</Text></TouchableOpacity>
        <View style={{flex:1}} />
        <TouchableOpacity style={styles.ghostBtn} onPress={() => {/* preview */}}><Text style={styles.ghostText}>Preview</Text></TouchableOpacity>
        <TouchableOpacity style={styles.primaryBtnSmall} onPress={submit}><Text style={styles.primaryBtnText}>{loading ? "Posting..." : "Post"}</Text></TouchableOpacity>
      </View>
    </View>
  );
}