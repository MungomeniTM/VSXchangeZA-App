// src/screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../api";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const doLogin = async () => {
    if (!email || !password) return Alert.alert("Provide email and password");
    try {
      setLoading(true);
      const res = await login({ email, password });
      setLoading(false);
      const token = res.data.token;
      const user = res.data.user;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      navigation.replace("Dashboard");
    } catch (err) {
      setLoading(false);
      console.error(err?.response?.data || err.message);
      Alert.alert("Login failed", err?.response?.data?.error || err?.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to VSXchangeZA</Text>
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={doLogin}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Login</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 12 }}>
        <Text style={{ color: "#444" }}>Create an account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginTop: 8 },
  button: { backgroundColor: "#1f6feb", padding: 14, borderRadius: 8, marginTop: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" }
});