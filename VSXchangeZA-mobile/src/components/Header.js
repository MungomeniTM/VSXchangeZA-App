import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/dashboardStyles";
import { useTheme } from "react-native-paper";

export default function Header({ title, onLogout, navigation }) {
  const theme = useTheme();
  return (
    <View style={styles.appbar}>
      <View style={styles.appbarRow}>
        <TouchableOpacity onPress={() => navigation?.toggleDrawer?.()} style={styles.hamburger}>
          <View style={styles.hLine} /><View style={styles.hLine} /><View style={styles.hLine} />
        </TouchableOpacity>

        <Text style={styles.brand}>{title}</Text>

        <View style={{ flex: 1 }} />

        <TouchableOpacity style={styles.topBtn} onPress={() => navigation?.navigate?.("Search")}>
          <Text style={styles.topBtnText}>Search</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.topBtn} onPress={onLogout}>
          <Text style={styles.topBtnText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}