// src/screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secure, setSecure] = useState(true);

  const submit = async () => {
    if (!email.trim() || !password.trim())
      return Alert.alert("Missing Info", "Enter both email and password.");

    try {
      setLoading(true);
      const res = await login({ email, password });
      setLoading(false);

      const { token, user } = res.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      console.log("✅ Login successful:", user.email);
      Alert.alert("Welcome Back", `Hello, ${user.first_name || "User"}!`);
      navigation.replace("Dashboard");
    } catch (err) {
      setLoading(false);
      console.warn("❌ Login failed:", err?.response?.data || err.message);
      Alert.alert(
        "Login Failed",
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Sign in to continue your journey</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9aa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Password"
            placeholderTextColor="#9aa"
            secureTextEntry={secure}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setSecure(!secure)}
          >
            <Text style={styles.eyeIcon}>{secure ? "👁" : "🙈"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.switch}>
            Don’t have an account?{" "}
            <Text style={styles.link}>Create one</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =====================
// 💎 STYLES (Matches RegisterScreen)
// =====================
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#0d1117",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: "#9aa",
    fontSize: 15,
    marginBottom: 25,
  },
  input: {
    width: "100%",
    backgroundColor: "#161b22",
    color: "#fff",
    padding: 14,
    marginBottom: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222",
    fontSize: 16,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161b22",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#222",
    marginBottom: 18,
  },
  eyeButton: {
    paddingHorizontal: 10,
  },
  eyeIcon: {
    color: "#00C851",
    fontSize: 18,
  },
  button: {
    width: "100%",
    backgroundColor: "#00C851",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#00C851",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
  switch: {
    color: "#9aa",
    marginTop: 18,
    fontSize: 15,
  },
  link: {
    color: "#00C851",
    fontWeight: "700",
  },
});