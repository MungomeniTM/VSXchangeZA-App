// src/screens/RegisterScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { register } from "../api";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const doRegister = async () => {
    if (!name || !email || !password) return Alert.alert("Fill all fields");
    try {
      setLoading(true);
      const payload = { first_name: name.split(" ")[0] || name, last_name: name.split(" ").slice(1).join(" ") || "", email, password, role: "client" };
      const res = await register(payload);
      setLoading(false);
      Alert.alert("Success", "Registered — please login");
      navigation.replace("Login");
    } catch (err) {
      setLoading(false);
      console.error(err?.response?.data || err.message);
      Alert.alert("Registration failed", err?.response?.data?.error || err?.response?.data?.message || "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join VSXchangeZA</Text>
      <TextInput placeholder="Full name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Email" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={doRegister}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Register</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 12 }}>
        <Text style={{ color: "#444" }}>Already a client? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 8, marginTop: 8 },
  button: { backgroundColor: "#1f6feb", padding: 14, borderRadius: 8, marginTop: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700" }
});