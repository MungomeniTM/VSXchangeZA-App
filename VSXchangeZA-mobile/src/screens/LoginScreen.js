// src/screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !password) return Alert.alert("Error", "Enter email and password.");
    try {
      setLoading(true);
      const res = await login({ email, password });
      setLoading(false);
      const { token, user } = res.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      navigation.replace("Dashboard");
    } catch (err) {
      setLoading(false);
      console.warn("Login failed:", err?.response?.data || err.message);
      Alert.alert("Login failed", err?.response?.data?.detail || err?.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#9aa" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#9aa" secureTextEntry value={password} onChangeText={setPassword} />

        <TouchableOpacity style={styles.button} onPress={submit} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Signing in..." : "Login"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.switch}>Create an account</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#0d1117", alignItems: "center", justifyContent: "center" },
  title: { color: "#fff", fontSize: 28, fontWeight: "800" },
  subtitle: { color: "#9aa", marginBottom: 20 },
  input: { width: "100%", backgroundColor: "#161b22", color: "#fff", padding: 12, marginBottom: 12, borderRadius: 8, borderWidth: 1, borderColor: "#222" },
  button: { width: "100%", backgroundColor: "#00C851", padding: 14, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "700" },
  switch: { color: "#9aa", marginTop: 12 }
});