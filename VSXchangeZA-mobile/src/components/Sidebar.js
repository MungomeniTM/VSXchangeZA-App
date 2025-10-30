import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/dashboardStyles";

export default function Sidebar({ style, navigation, onCreatePost }) {
  return (
    <View style={[styles.sidebarCard, style]}>
      <View style={styles.userCard}>
        <View style={styles.avatar}><Text style={styles.avatarInitial}>U</Text></View>
        <View>
          <Text style={styles.hello}>Welcome, <Text style={styles.bold}>User</Text></Text>
          <Text style={styles.mutedSmall}>Role • Location</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={onCreatePost}><Text style={styles.primaryBtnText}>+ Create Post</Text></TouchableOpacity>

      <View style={styles.sideLinks}>
        <Text style={styles.sideTitle}>My Dashboard</Text>
        <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.linkText}>My Skills</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate("Listings")}>
          <Text style={styles.linkText}>My Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate("Requests")}>
          <Text style={styles.linkText}>Exchange Requests</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}