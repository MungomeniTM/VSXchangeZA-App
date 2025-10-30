// src/components/Header.js
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import styles, { COLORS } from "../styles/dashboardStyles";

export default function Header({ onOpenSidebar, onSearch }) {
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={onOpenSidebar} accessibilityLabel="Open menu">
        <Feather name="menu" size={22} color={COLORS.text} />
      </TouchableOpacity>

      <Text style={styles.brand}>VSXchangeZA</Text>

      <View style={{ flex: 1, marginLeft: 12, marginRight: 12 }}>
        <TextInput
          placeholder="Search skills, people, farms…"
          placeholderTextColor={COLORS.muted}
          style={styles.searchInput}
          onSubmitEditing={(e) => onSearch?.(e.nativeEvent.text)}
        />
      </View>

      <TouchableOpacity onPress={() => onSearch?.("messages")}>
        <AntDesign name="message1" size={20} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}